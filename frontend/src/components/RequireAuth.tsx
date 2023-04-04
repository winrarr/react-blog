import { Navigate, Outlet, useLocation } from "react-router-dom"
import { UserLevel } from "../@types/auth"
import { useAuth } from "../context/AuthProvider"

const RequireAuth = ({ requiredUserLevel }: { requiredUserLevel: UserLevel }) => {
    const { userLevel } = useAuth()
    const location = useLocation()

    return (
        !userLevel
            ? <Navigate to="/login" state={{ from: location }} replace />
            : userLevel >= requiredUserLevel
                ? <Outlet />
                : <Navigate to="/unauthorized" state={{ from: location }} replace />
    )
}

export default RequireAuth