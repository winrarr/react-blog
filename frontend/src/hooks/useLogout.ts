import { UserLevel } from "../@types/auth"
import { logout } from "../axios/axiosPrivate"
import useAuth from "./useAuth"

const useLogout = () => {
  const { setUserLevel } = useAuth()

  return async () => {
    await logout()
    setUserLevel(UserLevel.GUEST)
  }
}

export default useLogout