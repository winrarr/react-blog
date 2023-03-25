import { Route, Routes } from 'react-router-dom'
import { UserLevel } from './@types/auth'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import { Admin } from './pages/Admin'
import { Dashboard } from './pages/Dashboard'
import { HomePage } from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import { NoMatch } from './pages/NoMatch'
import { Unauthorized } from './pages/Unauthorised'
import NewBlogPost from './pages/NewBlogPost'
import PersistLogin from './components/PersistLogin'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="unauthorised" element={<Unauthorized />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="newblog" element={<NewBlogPost />} />

        {/* private routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth requiredUserLevel={UserLevel.USER} />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>

          <Route element={<RequireAuth requiredUserLevel={UserLevel.ADMIN} />}>
            <Route path="admin" element={<Admin />} />
          </Route>
        </Route>

        {/* catch all */}
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  )
}

export default App
