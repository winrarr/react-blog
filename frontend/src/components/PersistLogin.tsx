import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { refresh } from '../axios/axiosPrivate'
import useAuth from '../hooks/useAuth'

export const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true)
    const { userLevel: auth, persist } = useAuth()

    useEffect(() => {
        let isMounted = true

        !auth && persist ? refresh().then(() => isMounted && setIsLoading(false)) : setIsLoading(false)

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