import { Route, Routes } from 'react-router-dom'
import { UserLevel } from './@types/auth'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import { Admin } from './pages/Admin'
import { Dashboard } from './pages/Dashboard'
import { HomePage } from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import { NoMatch } from './pages/NoMatch'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />

        {/* private routes */}
        <Route element={<RequireAuth requiredUserLevel={UserLevel.User} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<RequireAuth requiredUserLevel={UserLevel.Admin} />}>
          <Route path="/admin" element={<Admin />} />
        </Route>

        {/* catch all */}
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  )
}

export default App
