import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import ArtistPage from './ArtistPage'
import AboutPage from './AboutPage'
import ContactPage from './ContactPage'
import NotFound from './NotFound'
import './index.css'
import * as serviceWorkerRegistration from './serviceWorkerRegistration' // ADD THIS LINE

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/artist/:slug" element={<ArtistPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)

// ADD THIS LINE
serviceWorkerRegistration.register();
