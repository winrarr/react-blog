import { createContext, ReactNode, useState } from "react"
import { AuthContextType, UserLevel } from "../@types/auth"
import useLocalStorage from "../hooks/useLocalStorage"

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null)
  const [userLevel, setUserLevel] = useState<UserLevel>(UserLevel.GUEST)
  const [persist, setPersist] = useLocalStorage("persist", false)

  return (
    <AuthContext.Provider value={{ username, setUsername, userLevel, setUserLevel, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext