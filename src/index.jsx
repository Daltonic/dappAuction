import './index.css'
import App from './App'
import React from 'react'
import ReactDOM from 'react-dom'
import 'react-toastify/dist/ReactToastify.css'
import { initCometChat } from './services/chat'
import { BrowserRouter } from 'react-router-dom'

initCometChat().then(() => {
  ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById('root'),
  )
})
