import axios from "axios"
import React, { useState } from "react"

function RecordVoice() {
  const [audioUrl, setAudioUrl] = useState("")
  const [isReacording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  // const [file, setFile] = useState("")
  const [AudioFile, setAudioFile] = useState(null)

  let audioChunks = []

  // console.log(audioUrl)

  const startRecording = async () => {
    const strem = await navigator.mediaDevices.getUserMedia({ audio: true })

    const recorder = new MediaRecorder(strem)

    recorder.ondataavailable = (e) => {
      audioChunks.push(e.data)
      // console.log(audioChunks)
    }

    recorder.onstop = () => {
      const audio = new Blob(audioChunks, {
        type: "audio/ogg codecs=opus"
      })

      console.log(audio)
      const audioUrl = URL.createObjectURL(audio)
      setAudioUrl(audioUrl)

      // const reader = new FileReader()

      // reader.readAsDataURL(audio)

      // reader.onloadend = () => {
      //   setFile(reader.result)
      // }

      const file = new File([audio], "audio.mp3")
      setAudioFile(file)
      audioChunks = []
    }
    recorder.start()
    setIsRecording(true)
    setMediaRecorder(recorder)
  }
  // console.log(file)
  console.log(AudioFile)

  const stopRecording = () => {
    setIsRecording(false)
    if (mediaRecorder) {
      mediaRecorder.stop()
    }
  }

  const sendToBackend = async () => {
    const formData = new FormData()
    formData.append("audio", AudioFile)

    const res = await axios.post("http://localhost:5000/upload", formData, {
      "Content-Type": "multipart/form-data"
    })

    alert(res.data.message)
  }

  return (
    <div>
      <div className="btns">
        <button
          className="btn"
          disabled={isReacording}
          onClick={startRecording}
        >
          {isReacording ? "Recording" : "Start Recording"}
        </button>
        <button
          className="btn"
          disabled={!isReacording}
          onClick={stopRecording}
        >
          Stop Recording
        </button>
        <button className="btn" onClick={sendToBackend}>
          Generate video
        </button>
      </div>
      {audioUrl && <audio controls src={audioUrl} />}
    </div>
  )
}

export default RecordVoice
