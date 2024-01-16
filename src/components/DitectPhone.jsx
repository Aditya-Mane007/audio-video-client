import React, { useState } from "react"
import axios from "axios"

function AudioRecording() {
  const [recording, setRecording] = useState(false)
  const [audioChunks, setAudioChunks] = useState([])
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [audioURL, setAudioURL] = useState("")
  // console.log(audioURL)
  // console.log(audioChunks)

  const startRecording = async () => {
    try {
      if (navigator.mediaDevices || navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true
        })

        const recorder = new MediaRecorder(stream)

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setAudioChunks((prevChunks) => [...prevChunks, event.data])
          }
          // const reader = new FileReader()
          // reader.onloadend = () => {
          //   const base64Data = reader.result.split(",")[1]

          //   console.log(base64Data)
          //   setAudioChunks(base64Data)
          //   // updateAudioData()
          // }
          // reader.readAsDataURL(event.data)
        }

        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, {
            type: "audio/mp3"
          })

          // const url = URL.createObjectURL(audioBlob)
          // setAudioURL(url)

          const reader = new FileReader()

          reader.readAsDataURL(audioBlob)

          console.log(reader.result)

          return new Promise((resolve) => {
            reader.onloadend = () => {
              resolve(reader.result)
            }
          })
        }

        recorder.start()
        setRecording(true)
        setMediaRecorder(recorder)
      } else {
        console.error("Error recording audio")
      }
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      setRecording(false)
    }
  }

  // console.log(audioChunks)

  const blobTobase64 = async (blob) => {
    const reader = new FileReader()

    reader.readAsDataURL(blob)

    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result)
      }
    })
  }
  // const sentToBackend = async (audioBlob) => {
  //   const data = blobTobase64(audioBlob)
  //   console.log(data)
  //   // const file = "data:audio/webm;base64," + data

  //   // const formData = new FormData()
  //   // formData.append("audio", file)
  //   // const res = await axios.post("http://localhost:5000/upload", formData)
  // }

  return (
    <div>
      <div className="btns">
        <button onClick={startRecording} disabled={recording} className="btn">
          {recording ? "Recording..." : "Start Recording"}
        </button>
        <button onClick={stopRecording} disabled={!recording} className="btn">
          Stop Recording
        </button>
        <button
          className="btn"
          // onClick={() => {
          //   sentToBackend(audioBlob)
          // }}
        >
          generate video
        </button>
      </div>
      {audioURL && (
        <div>
          <p>Audio recording:</p>
          <audio controls src={audioURL} />
        </div>
      )}
    </div>
  )
}

export default AudioRecording
