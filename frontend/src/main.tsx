import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Buffer } from 'buffer'
import process from 'process'
import App from './App.tsx'
import './index.css'

// Polyfills for Solana packages
window.Buffer = Buffer
;(window as any).global = window
;(window as any).process = process

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
