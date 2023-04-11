import { Link, useNavigate } from "react-router-dom"
import { UserLevel } from "../@types/auth"
import { useAuth } from "../context/AuthProvider"
import "../styles/layout/_navbar.scss"

const Navbar = () => {
  const { userLevel, logout } = useAuth()
  const navigate = useNavigate()

  const signout = async () => {
    await logout()
    navigate("/")
  }

  const userLinks = <Link to="/dashboard">Dashboard</Link>

  const adminLinks = (
    <>
      <Link to="/newblog">New blog</Link>
      <Link to="/admin">Admin</Link>
    </>
  )

  const authLink = userLevel
    ? <Link onClick={signout} to="/">Log out</Link>
    : (
      <div>
        <Link to="/signup">Sign up</Link>
        <Link to="/login">Log in</Link>
      </div>
    )

  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      {userLevel >= UserLevel.USER && userLinks}
      {userLevel >= UserLevel.ADMIN && adminLinks}
      {authLink}
    </nav>
  )
}

export default Navbar