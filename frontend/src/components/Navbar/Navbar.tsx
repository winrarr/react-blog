import { Link, useNavigate } from "react-router-dom"
import { UserLevel } from "../../@types/auth"
import AdminLinks from "./AdminLinks"
import UserLinks from "./UserLinks"
import { useAuth } from "../../context/AuthProvider"

const Navbar = () => {
  const { userLevel, logout } = useAuth()
  const navigate = useNavigate()

  const signout = async () => {
    await logout()
    navigate("/")
  }

  const authLink = userLevel
    ? <Link onClick={signout} to="/">Log out</Link>
    : <Link to="/login">Log in</Link>

  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      {userLevel >= UserLevel.USER && <UserLinks />}
      {userLevel >= UserLevel.ADMIN && <AdminLinks />}
      {authLink}
    </nav>
  )
}

export default Navbar