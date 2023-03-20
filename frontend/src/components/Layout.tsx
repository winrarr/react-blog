import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

interface Props { children: JSX.Element | JSX.Element[] }

const Layout = () => {
  // try using main instead of div
  return (
    <>
      <Navbar />
      <div className="container">
        <Outlet />
      </div>
    </>
  )
}

export default Layout