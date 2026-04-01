import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isLoggedIn, isAdmin, loading } = useAuth()

    if (loading) {
        return <div>Loading...</div>
    }

    if (!isLoggedIn) {
        return <Navigate to='/login' />
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to='/' />
    }

    return children
}

export default ProtectedRoute