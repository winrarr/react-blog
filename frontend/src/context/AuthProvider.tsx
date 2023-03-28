import { createContext, ReactNode, useState } from "react"
import { AuthContextType, Auth } from "../@types/auth"
import useLocalStorage from "../hooks/useLocalStorage"

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<Auth | null>(null)

  const [persist, setPersist] = useLocalStorage("persist", false)

  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext