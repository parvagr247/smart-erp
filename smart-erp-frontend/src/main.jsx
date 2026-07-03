import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'
import { ActiveCompanyProvider } from './context/ActiveCompanyContext'
import { AuthProvider } from './context/AuthContext'
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
