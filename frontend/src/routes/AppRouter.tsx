import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PublicRoutes, PrivateRoutes } from './'

enum Status {
    checking,
    authenticated,
    notAuthenticated,
}

let status: Status = Status.notAuthenticated

export function AppRouter() {

    if (status === Status.checking) return <div className="loading">Checking credentials...</div>

    return (
        <BrowserRouter>
            <Routes>
                {
                    status === Status.authenticated
                    ? <Route path='/*' element={<PrivateRoutes />} />
                    : <Route path='/*' element={<PublicRoutes />} />
                }

                <Route path='*' element={<Navigate to='/login' replace />} />
            </Routes>
        </BrowserRouter>
    )
}