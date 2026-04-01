import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const Register = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { register } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (password.length < 6) {
            return setError('Password must be at least 6 characters')
        }
        setLoading(true)
        try {
            await register({ name, email, password })
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='form-container'>
            <h2>Create Account</h2>
            {error && <div className='form-error'>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label>Full Name</label>
                    <input
                        type='text'
                        placeholder='Enter your full name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className='form-group'>
                    <label>Email</label>
                    <input
                        type='email'
                        placeholder='Enter your email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className='form-group'>
                    <label>Password</label>
                    <input
                        type='password'
                        placeholder='At least 6 characters'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type='submit' className='form-submit' disabled={loading}>
                    {loading ? 'Creating account...' : 'Register'}
                </button>
            </form>
            <div className='form-footer'>
                Already have an account? <Link to='/login'>Login</Link>
            </div>
        </div>
    )
}

export default Register