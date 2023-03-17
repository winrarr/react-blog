import { createContext, PropsWithChildren, ReactNode, useContext, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './components/navbar/Navbar'
import { Admin } from './pages/Admin'
import { Dashboard } from './pages/Dashboard'
import { HomePage } from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import { NoMatch } from './pages/NoMatch'
import Router from './routes/Router'

const fakeAuth = (): Promise<any> =>
  new Promise((resolve) => {
    setTimeout(() => resolve('2342f2f1d131rf12'), 250)
  })

interface authContextType {
  token: string | null,
  onLogin: () => Promise<void>,
  onLogout: () => void,
}

const AuthContext = createContext<authContextType | null>(null)

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const [token, setToken] = useState<null>(null)

  const handleLogin = async () => {
    const token = await fakeAuth()

    setToken(token)

    const origin = location.state?.from?.pathname || '/dashboard'
    navigate(origin)
  }

  const handleLogout = () => {
    setToken(null)
  }

  const value: authContextType = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  return useContext(AuthContext)!
}

const ProtectedRoute = ({ children }: { children: JSX.Element }): JSX.Element => {
  const { token } = useAuth()
  const location = useLocation()

  if (!token) {
    return <Navigate to="/home" replace state={{ from: location }} />
  }

  return children
}

function App() {
  return (
    <AuthProvider>

      <Navbar />

      <div className="container">

        <Routes>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NoMatch />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
