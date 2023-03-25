import jwtDecode from "jwt-decode"
import { Link } from "react-router-dom"
import { AccessTokenClaims, UserLevel } from "../../@types/auth"
import useAuth from "../../hooks/useAuth"
import AdminLinks from "./AdminLinks"
import UserLinks from "./UserLinks"

const Navbar = () => {
  const { auth, clearAuth } = useAuth()

  const authLink = auth
    ? <Link onClick={() => clearAuth()} to="/">Log out</Link>
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