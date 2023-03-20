export default function Navbar() {
  return (
    <nav className="navbar">
      <a href="/homepage">LOGO</a>
      <input type="checkbox" id="toggler" />
      <label htmlFor="toggler">
        <ul>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </label>
      <div>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/admin">Admin</a></li>
          <li><a href="/login">Login</a></li>
          <div></div>
        </ul>
      </div>
    </nav>
  )
}