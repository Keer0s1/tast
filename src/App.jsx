//import { useState } from 'react'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Greeting from './components/Greeting/index'

import Header from './components/Header/index'

import TaskManager from './components/TaskManasger'

const App = () => {

  return(
    <>
    <Header />
    <Greeting />
    <TaskManager />
    </>
  )
  
}

export default App
