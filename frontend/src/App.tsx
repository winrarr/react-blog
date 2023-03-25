import { Route, Routes } from 'react-router-dom'
import { UserLevel } from './@types/auth'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import Admin from './pages/Admin'
import Dashboard from './pages/Dashboard'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import NoMatch from './pages/NoMatch'
import Unauthorized from './pages/Unauthorized'
import NewBlog from './pages/NewBlog'
import PersistLogin from './components/PersistLogin'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route element={<PersistLogin />}>
          {/* public routes */}
          <Route index element={<HomePage />} />
          <Route path="login" element={<AuthPage />} />
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
