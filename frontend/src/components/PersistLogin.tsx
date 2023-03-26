import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import useRefreshToken from '../hooks/useRefreshToken'

export const PersistLogin = () => {
    const refreshToken = useRefreshToken()
    const { auth, persist } = useAuth()

    !auth && persist && refreshToken()

    return (
        <Outlet />
    )
}

export default PersistLogin