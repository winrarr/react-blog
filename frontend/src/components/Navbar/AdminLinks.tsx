import { Link } from "react-router-dom"

const AdminLinks = () => {
  return (
    <>
      <Link to="/newblog">New blog</Link>
      <Link to="/admin">Admin</Link>
    </>
  )
}

export default AdminLinks