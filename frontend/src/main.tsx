import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthProvider'
import './styles/main.scss'
import dotenv from 'dotenv'
import { disableReactDevTools } from '@fvilers/disable-react-devtools'

dotenv.config({ path: "../.env" })
if (process.env.MODE === "production") disableReactDevTools()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="*" element={<App />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
