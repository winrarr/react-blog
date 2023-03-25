import jwtDecode from "jwt-decode";
import { Link } from "react-router-dom";
import { AccessTokenClaims, UserLevel } from "../@types/auth";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { auth, clearAuth } = useAuth()

  const authLink = auth
    ? <Link id="auth-link" onClick={() => clearAuth()} to="/">Log out</Link>
    : <Link id="auth-link" to="/login">Log in</Link>

  return (
    <nav className="navbar">
      <Link id="home-link" to="/dashboard">Home</Link>
      {auth && jwtDecode<AccessTokenClaims>(auth.accessToken).userLevel >= UserLevel.ADMIN &&
        <Link id="new-blog-link" to="/newblog">New blog</Link>}
      {authLink}
    </nav>
  )
}

export default Navbar