import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { auth, clearAuth } = useAuth()

  return (
    <>
      <Link id="home-link" to="/">Home</Link>
      {auth
        ? <Link onClick={() => clearAuth()} id="auth-link" to="#">Log out</Link>
        : <Link id="auth-link" to="/login">Log in</Link>}
    </>
  )
}

export default Navbar