import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import Media from './components/Media'
import Audio from './components/Audio'
import AudioWaves from './components/AudioWaves'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
        </header>
        <Media />
        <Audio />
        <AudioWaves />
      </div>
    )
  }
}

export default App
