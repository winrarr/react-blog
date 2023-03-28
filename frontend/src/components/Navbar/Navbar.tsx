import jwtDecode from "jwt-decode"
import { Link, useNavigate } from "react-router-dom"
import { AccessTokenClaims, UserLevel } from "../../@types/auth"
import useAuth from "../../hooks/useAuth"
import AdminLinks from "./AdminLinks"
import UserLinks from "./UserLinks"
import useLogout from "../../hooks/useLogout"

const Navbar = () => {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const logout = useLogout()

  const signout = async () => {
    await logout()
    navigate("/")
  }

  const authLink = auth
    ? <Link onClick={signout} to="/">Log out</Link>
    : <Link to="/login">Log in</Link>

  const userLevel = auth && jwtDecode<AccessTokenClaims>(auth.accessToken).userLevel || UserLevel.GUEST

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