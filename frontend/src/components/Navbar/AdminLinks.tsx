import { Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const AdminLinks = () => {
  return (
    <>
      <Link to="/newblog">New blog</Link>
      <Link to="/admin">Admin</Link>
    </>
  )
}

export default AdminLinks