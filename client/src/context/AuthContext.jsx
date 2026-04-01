import { createContext, useContext, useState, useEffect } from 'react'
import { login as loginAPI, register as registerAPI, getMe } from '../api/auth.js'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, [])

    const login = async (credentials) => {
        const data = await loginAPI(credentials)
        setUser(data)
        localStorage.setItem('user', JSON.stringify(data))
        return data
    }

    const register = async (userData) => {
        const data = await registerAPI(userData)
        setUser(data)
        localStorage.setItem('user', JSON.stringify(data))
        return data
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
    }

    const isAdmin = user?.role === 'admin'
    const isLoggedIn = !!user

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            isAdmin,
            isLoggedIn
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}