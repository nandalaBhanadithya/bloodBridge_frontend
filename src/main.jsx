import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'

console.log('Main.jsx: Starting app...')

const rootElement = document.getElementById('root')
console.log('Main.jsx: Root element:', rootElement)

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

console.log('Main.jsx: App rendered')
