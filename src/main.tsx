import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/fraunces/500.css'
import '@fontsource/fraunces/700.css'
import '@fontsource/source-sans-3/400.css'
import '@fontsource/source-sans-3/600.css'
import '@fontsource/source-sans-3/700.css'
import './index.css'
import App from './App'
import { WORLDS } from './content/loadWorlds'

// Touch WORLDS so invalid content throws loudly at startup.
if (WORLDS.length !== 5) {
  throw new Error(`Expected 5 worlds, found ${WORLDS.length}`)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
