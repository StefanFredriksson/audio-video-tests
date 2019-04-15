import React, { Component } from 'react'

/**
 * Component for the audio visualization using bars.
 */
export default class Audio extends Component {
  componentDidMount () {
    let canvas = document.querySelector('#bar-canvas')
    let div = document.querySelector('#bar-canvas-div')
    let inner = document.querySelector('#inner')

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false
      })
      .then(stream => {
        let context = new window.AudioContext()
        let src = context.createMediaStreamSource(stream)
        let analyzer = context.createAnalyser()
        canvas.width = div.offsetWidth
        canvas.height = div.offsetHeight

        let ctx = canvas.getContext('2d')
        src.connect(analyzer)

        analyzer.fftSize = 32 // Effects number of columns. Needs to be a power of 2 between 2 to power of 5 and 2 to power of 15.
        // Possible values: 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, and 32768

        let bufferLength = analyzer.frequencyBinCount // Half of fftsize
        let max = bufferLength * 255 // 255 is the max each element in the dataArray can be
        let dataArray = new Uint8Array(bufferLength)

        let WIDTH = canvas.width
        let HEIGHT = canvas.height

        let barWidth = WIDTH / bufferLength
        let barHeight
        let x = 0

        function renderFrame () {
          window.requestAnimationFrame(renderFrame)

          x = 0
          analyzer.getByteFrequencyData(dataArray)
          ctx.fillStyle = '#000'
          ctx.fillRect(0, 0, WIDTH, HEIGHT)
          let count = 0
          for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2 // Goes above the canvas if don't divide by 2
            count += dataArray[i]
            let r = barHeight + 25 * (i / bufferLength)
            let g = 250 * (i / bufferLength)
            let b = 50

            ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')'
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight)
            x += barWidth
          }
          let percent = (count / max).toFixed(4) * 100 + '%'
          inner.style.width = percent
        }
        renderFrame()
      })
  }

  render () {
    return (
      <div id='content'>
        <div id='bar-canvas-div'>
          <canvas id='bar-canvas' />
        </div>

        <div id='outer'>
          <div id='inner' />
        </div>
      </div>
    )
  }
}
