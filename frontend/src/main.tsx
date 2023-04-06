import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthProvider'
// import './styles/main.scss'
import { disableReactDevTools } from '@fvilers/disable-react-devtools'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ThemeProvider, unstable_createMuiStrictModeTheme } from '@mui/material'

if (import.meta.env.PROD) {
  disableReactDevTools()
}

const theme = unstable_createMuiStrictModeTheme()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GoogleOAuthProvider clientId="159781938590-0nivkjv9f0iscnm9nvdsa9h4c3hl4hl8.apps.googleusercontent.com">
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="*" element={<App />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </ThemeProvider>
  </React.StrictMode>
)
