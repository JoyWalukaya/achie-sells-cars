import API from './axios.js'

export const register = async (userData) => {
    const response = await API.post('/auth/register', userData)
    return response.data
}

export const login = async (userData) => {
    const response = await API.post('/auth/login', userData)
    return response.data
}

export const verifyEmail = async (data) => {
    const response = await API.post('/auth/verify', data)
    return response.data
}

export const resendCode = async (email) => {
    const response = await API.post('/auth/resend-code', { email })
    return response.data
}

export const getMe = async () => {
    const response = await API.get('/auth/me')
    return response.data
}
export const forgotPassword = async (email) => {
    const response = await API.post('/auth/forgot-password', { email })
    return response.data
}

export const resetPassword = async (data) => {
    const response = await API.post('/auth/reset-password', data)
    return response.data
}