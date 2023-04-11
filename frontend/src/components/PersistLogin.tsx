import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

export const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true)
    const { userLevel, refresh, persist } = useAuth()

    useEffect(() => {
        let isMounted = true

        const verifyRefreshToken = async () => {
            try {
                await refresh()
            }
            finally {
                isMounted && setIsLoading(false)
            }
        }

        !userLevel && persist ? verifyRefreshToken() : setIsLoading(false)

        return () => { isMounted = false }
    }, [])

    return (
        <>
            {!persist
                ? <Outlet />
                : isLoading
                    ? <p>Loading...</p>
                    : <Outlet />
            }
        </>
    )
}

export default PersistLogin