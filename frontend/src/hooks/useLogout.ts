import { HttpStatusCode } from "axios"
import useAuth from "./useAuth"
import useAxiosPrivate from "./useAxiosPrivate"

const useLogout = () => {
  const { setAuth } = useAuth()
  const axiosPrivate = useAxiosPrivate()

  return async() => {
    await axiosPrivate.get("/logout")
    setAuth(null)
  }
}

export default useLogout