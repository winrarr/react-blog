import { createContext, useState } from "react"
import { AuthContextType, IAuth } from "../@types/auth"

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: any) => {
  const [auth, setAuth] = useState<IAuth | null>(null)
  const clearAuth = () => setAuth(null)

  return (
    <AuthContext.Provider value={{ auth, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext