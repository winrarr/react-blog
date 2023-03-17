import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom"
import { HomePage } from "../pages/HomePage"
import LoginPage from "../pages/LoginPage"

const PrivateRoutes = () => {
    const location = useLocation()
    const authed = false

    return authed
        ? <Outlet />
        : <Navigate to="/login" replace state={{ from: location }} />
}

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PrivateRoutes />} >
                    <Route path="homepage" element={<HomePage />} />
                </Route>
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </BrowserRouter>
    )
}