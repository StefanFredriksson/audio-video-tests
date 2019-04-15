import React, { Component } from 'react'

/**
 * Component for the oscilloscope.
 */
export default class AudioWaves extends Component {
  componentDidMount () {
    let canvas = document.querySelector('#wave-canvas')
    let div = document.querySelector('#wave-canvas-div')

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false
      })
      .then(stream => {
        let context = new window.AudioContext()
        let src = context.createMediaStreamSource(stream)
        let analyser = context.createAnalyser()

        canvas.width = div.offsetWidth
        canvas.height = div.offsetHeight

        let ctx = canvas.getContext('2d')
        src.connect(analyser)

        let bufferLength = analyser.frequencyBinCount
        let dataArray = new Uint8Array(bufferLength)
        analyser.getByteTimeDomainData(dataArray)

        let WIDTH = canvas.width
        let HEIGHT = canvas.height

        function draw () {
          window.requestAnimationFrame(draw)

          analyser.getByteTimeDomainData(dataArray)

          ctx.lineWidth = 2
          ctx.strokeStyle = '#000000'
          ctx.clearRect(0, 0, WIDTH, HEIGHT)

          ctx.beginPath()

          let sliceWidth = (WIDTH * 1.0) / bufferLength
          let x = 0
          ctx.moveTo(0, HEIGHT / 2)

          for (let i = 0; i < bufferLength; i++) {
            let y = (dataArray[i] / 255.0) * HEIGHT
            ctx.lineTo(x, y)

            x += sliceWidth
          }
          ctx.lineTo(x, HEIGHT / 2)
          ctx.stroke()
        }

        draw()
      })
  }

  render () {
    return (
      <div>
        <div id='wave-canvas-div'>
          <canvas id='wave-canvas' />
        </div>
      </div>
    )
  }
}
