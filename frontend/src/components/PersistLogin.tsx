import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import useRefreshToken from '../hooks/useRefreshToken'

export const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true)
    const refreshToken = useRefreshToken()
    const { auth, persist } = useAuth()

    useEffect(() => {
        let isMounted = true

        const refresh = async () => {
            await refreshToken()
            isMounted && setIsLoading(false)
        }

        !auth && persist ? refresh() : setIsLoading(false)

        return () => { isMounted = false }
    }, [])

    return (
        <>
            {!persist
                ? <Outlet />
                : isLoading
                    ? <p>Loading...</p>
                    : <Outlet />}
        </>
    )
}

export default PersistLogin