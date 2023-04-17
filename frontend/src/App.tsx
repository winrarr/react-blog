import { Route, Routes } from 'react-router-dom'
import { UserLevel } from './@types/auth'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import Admin from './pages/AdminPage'
import Dashboard from './pages/Dashboard'
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import NoMatch from './pages/NoMatch'
import Unauthorized from './pages/Unauthorized'
import NewBlog from './pages/NewBlogPage'
import PersistLogin from './components/PersistLogin'
import SignupPage from './pages/auth/SignupPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route element={<PersistLogin />}>
          {/* public routes */}
          <Route index element={<HomePage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="unauthorised" element={<Unauthorized />} />

          {/* private routes */}
          <Route element={<RequireAuth requiredUserLevel={UserLevel.USER} />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>

          <Route element={<RequireAuth requiredUserLevel={UserLevel.ADMIN} />}>
            <Route path="admin" element={<Admin />} />
            <Route path="newblog" element={<NewBlog />} />
          </Route>
        </Route>

        {/* catch all */}
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  )
}

export default App
