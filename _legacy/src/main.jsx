import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// CSS imported normally - Vite will extract it in production
// Critical CSS is inlined in index.html to prevent render blocking
import('./index.css')

try {
  const rootElement = document.getElementById('root')
  if (!rootElement) {
    throw new Error('Root element not found')
  }
  
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} catch (error) {
  console.error('Failed to render app:', error)
  document.body.innerHTML = `
    <div style="padding: 2rem; color: white; background: #0a0a0a; font-family: monospace;">
      <h1>Error loading application</h1>
      <p>${error.message}</p>
      <pre>${error.stack}</pre>
    </div>
  `
}

