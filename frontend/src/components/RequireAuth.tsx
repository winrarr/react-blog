import { Navigate, Outlet, useLocation } from "react-router-dom"
import { UserLevel } from "../@types/auth"
import useAuth from "../hooks/useAuth"

const RequireAuth = ({ requiredUserLevel }: { requiredUserLevel: UserLevel }) => {
    const { auth } = useAuth()
    const location = useLocation()
    const userLevel = auth?.userLevel || UserLevel.Guest

    return (
        userLevel >= requiredUserLevel
            ? <Outlet />
            : userLevel >= UserLevel.User
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    )
}

export default RequireAuth