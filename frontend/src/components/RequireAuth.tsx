import { Navigate, Outlet, useLocation } from "react-router-dom"
import { UserLevel } from "../@types/auth"
import useAuth from "../hooks/useAuth"

const RequireAuth = ({ userLevel }: { userLevel: UserLevel }) => {
    const authContext = useAuth()
    const location = useLocation()

    return (
        authContext?.auth?.userLevel >= userLevel
            ? <Outlet />
            : authContext?.auth.userLevel >= 0
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    )
}

export default RequireAuth