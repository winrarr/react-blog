import { Link } from "react-router-dom";
import { UserLevel } from "../@types/auth";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { auth, clearAuth } = useAuth()

  return (
    <nav className="navbar">
      <Link id="home-link" to="/dashboard">Home</Link>
      {!auth
        ? <Link id="auth-link" to="/login">Log in</Link>
        : <>
          {auth.userLevel >= UserLevel.Admin && <Link id="new-blog-link" to="/newblog">New blog</Link>}
          <Link id="auth-link" onClick={() => clearAuth()} to="/">Log out</Link>
        </>
      }
    </nav>
  )
}

export default Navbar