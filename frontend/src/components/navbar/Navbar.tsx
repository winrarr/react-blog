import './Navbar.scss'

// function Hamburger() {
//     return (
//         <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="butt" stroke-linejoin="arcs"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
//     )
// }

function Hamburger() {
    const bar = {
        width: "32px",
        height: "0.25rem",
        borderRadius: "10px",
        backgroundColor: "#c3c3c3",
        margin: "7px 0",
    }

    return (
        <div>
            <div style={bar}></div>
            <div style={bar}></div>
            <div style={bar}></div>
        </div>
    )
}

export default function Navbar() {
    return (
        <nav className="navbar">
            <a href="#" className="logo">LOGO</a>
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