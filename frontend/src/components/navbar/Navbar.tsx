export default function Navbar() {
  const Hamburger = () => (
    <ul className="hamburger">
      <li></li>
      <li></li>
      <li></li>
    </ul>
  )


  return (
    <nav className="navbar">
      <a href="#">LOGO</a>
      <input type="checkbox" id="toggler" />
      <label htmlFor="toggler"><Hamburger /></label>
      <div className="menu">
        <ul className="nav-list">
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
          <li><a href="#">Login</a></li>
          <div className="active"></div>
        </ul>
      </div>
    </nav>
  )
}