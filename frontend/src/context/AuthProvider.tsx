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
    const authResponse = await signup({
      username,
      password,
    })
    setUsername(authResponse.username)
    setUserLevel(authResponse.userLevel)
    setPersist(persist)
  }

  const loginConst = async (username: string, password: string, persist: boolean = false) => {
    const authResponse = await login({
      username,
      password,
    })
    setUsername(authResponse.username)
    setUserLevel(authResponse.userLevel)
    setPersist(persist)
  }

  const oauth2Const = async (token: string) => {
    const authResponse = await oauth2(token)
    setUsername(authResponse.username)
    setUserLevel(authResponse.userLevel)
    setPersist(true)
  }

  const logoutConst = async () => {
    await logout()
    setUsername(null)
    setUserLevel(UserLevel.GUEST)
    setPersist(false)
  }

  const refreshConst = async () => {
    const authResponse = await refresh()
    setUsername(authResponse.username)
    setUserLevel(authResponse.userLevel)
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