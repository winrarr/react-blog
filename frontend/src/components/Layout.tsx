import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

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