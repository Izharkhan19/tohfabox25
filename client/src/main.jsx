import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

const FALLBACK_IMAGE = '/logo.png';
const fallbackUrl = new URL(FALLBACK_IMAGE, window.location.origin).href;

document.addEventListener('error', (event) => {
  const target = event.target;

  if (!(target instanceof HTMLImageElement)) return;
  if (target.dataset.fallbackApplied === 'true') return;

  const currentSrc = target.currentSrc || target.src;
  if (!currentSrc || currentSrc === fallbackUrl) return;

  target.dataset.fallbackApplied = 'true';
  target.src = FALLBACK_IMAGE;
}, true);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
