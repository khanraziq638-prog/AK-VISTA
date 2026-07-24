import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Router from './Router'
import './styles.css'
import './admin-media.css'
import './founders.css'
import './premium.css'
import { LoadingScreen } from './components/animations/LoadingScreen'
import { SmoothScrollProvider } from './components/animations/SmoothScrollProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter><SmoothScrollProvider><LoadingScreen/><Router /></SmoothScrollProvider></BrowserRouter></React.StrictMode>)
