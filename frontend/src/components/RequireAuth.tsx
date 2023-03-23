import { Navigate, Outlet, useLocation } from "react-router-dom"
import { UserLevel } from "../@types/auth"
import useAuth from "../hooks/useAuth"

const RequireAuth = ({ requiredUserLevel }: { requiredUserLevel: UserLevel }) => {
    const { auth } = useAuth()
    const location = useLocation()

    return (
        !auth
            ? <Navigate to="/login" state={{ from: location }} replace />
            : auth.userLevel >= requiredUserLevel
                ? <Outlet />
                : <Navigate to="/unauthorized" state={{ from: location }} replace />
    )
}

export default RequireAuth