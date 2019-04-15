import React, { Component } from 'react'
import RecordRTC from 'recordrtc'

/**
 *  Component for recording video.
 */
export default class Media extends Component {
  componentDidMount () {
    this.counter = document.querySelector('#counter')

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true
      })
      .then(stream => {
        this.recorder = RecordRTC(stream, {
          type: 'video',
          mimeType: 'video/webm;codecs=vp8',
          bitsPerSecond: 1280000 // Quality of the video, higher = better quality
        })

        /* this.recorder
          .setRecordingDuration(10000)
          .onRecordingStopped(this.stopRecorderCallback) // Able to set recording duration (milliseconds) */

        let video = document.querySelector('#recorder')

        if ('srcObject' in video) {
          video.srcObject = stream
        }

        video.play()
      })
  }

  startRecording = e => {
    e.target.disabled = true // Disable the start recording button
    document.querySelector('#playback').src = null // Remove previously recorded video from video element
    this.recorder.startRecording()

    let count = 0
    this.counterInterval = setInterval(() => {
      this.counter.textContent = ++count + ' seconds.'
    }, 1000)
  }

  stopRecorderCallback = e => {
    clearInterval(this.counterInterval)
    let blob = this.recorder.getBlob()
    let url = ''
    if (blob !== undefined) {
      url = window.URL.createObjectURL(blob)
    }
    let playback = document.querySelector('#playback')

    this.fixChromeDuration(playback) // Duration won't exist on chrome without this

    playback.src = url
    this.counter.textContent = 'Not recording.'

    let form = new FormData()
    form.append('video', blob, 'blobby.webm')

    fetch('http://localhost:4000/savefile', {
      method: 'POST',
      body: form
    })

    document.querySelector('#startBtn').disabled = false
  }

  stopRecording = e => {
    this.recorder.stopRecording(() => {
      this.stopRecorderCallback()
    })
  }

  fixChromeDuration = playback => {
    playback.onloadedmetadata = e => {
      if (playback.duration === Infinity) {
        playback.currentTime = 1e101
        playback.ontimeupdate = function () {
          this.ontimeupdate = () => {}

          playback.currentTime = 0.001
        }
      }
    }
  }

  render () {
    return (
      <div>
        <h1 id='counter'>Not recording.</h1>
        <video id='recorder' muted />
        <video id='playback' controls />
        <button id='startBtn' onClick={this.startRecording}>
          Start Recording
        </button>
        <button onClick={this.stopRecording}>Stop Recording</button>
      </div>
    )
  }
}
