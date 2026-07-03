import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@shared/styles/global.css'
import App from './App.jsx'
import { ActiveCompanyProvider } from '@shared/context/ActiveCompanyContext'
import { AuthProvider } from '@shared/context/AuthContext'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ActiveCompanyProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ActiveCompanyProvider>
    </AuthProvider>
  </StrictMode>,
)
