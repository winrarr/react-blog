import { createContext, ReactNode, useContext, useState } from "react"
import { AuthContextType, UserLevel } from "../@types/auth"
import { logout, refresh } from "../axios/axiosPrivate"
import { login, oauth2, signup } from "../axios/axiosPublic"
import useLocalStorage from "../hooks/useLocalStorage"
import { CredentialResponse } from "@react-oauth/google"

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null)
  const [userLevel, setUserLevel] = useState<UserLevel>(UserLevel.GUEST)
  const [persist, setPersist] = useLocalStorage("persist", false)

  const signupConst = async (username: string, password: string) => {
    const loginResponse = await signup({
      username,
      password,
    })
    setUsername(username)
    setUserLevel(loginResponse.userLevel)
    setPersist(persist)
  }

  const loginConst = async (username: string, password: string, persist: boolean = false) => {
    const loginResponse = await login({
      username,
      password,
    })
    setUsername(username)
    setUserLevel(loginResponse.userLevel)
    setPersist(persist)
  }

  const oauth2Const = async (token: string) => {
    const userInfo = await oauth2(token)
    setUsername(userInfo.name)
    setUserLevel(userInfo.userLevel)
    setPersist(true)
  }

  const logoutConst = async () => {
    await logout()
    setUsername(null)
    setUserLevel(UserLevel.GUEST)
    setPersist(false)
  }

  const refreshConst = async () => {
    const userLevel = await refresh()
    setUserLevel(userLevel)
  }

  return (
    <AuthContext.Provider value={{
      username,
      userLevel,
      persist,
      login: loginConst,
      oauth2: oauth2Const,
      signup: signupConst,
      logout: logoutConst,
      refresh: refreshConst
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) throw new Error("useAuth has to be used within <AuthContext.Provider>")

  return context
}

export default AuthContext