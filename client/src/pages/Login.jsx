import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { verifyEmail, resendCode } from '../api/auth.js'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [code, setCode] = useState('')
    const [codeError, setCodeError] = useState('')
    const [codeLoading, setCodeLoading] = useState(false)
    const [resending, setResending] = useState(false)
    const [resendSuccess, setResendSuccess] = useState('')
    const { login, completeVerification } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const data = await login({ email, password })
            if (data.role === 'admin') {
                navigate('/admin')
            } else {
                navigate('/')
            }
        } catch (err) {
            if (err.response?.data?.needsVerification) {
                setShowModal(true)
                return
            }
            setError(err.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    const handleVerify = async (e) => {
    e.preventDefault()
    setCodeError('')
    setCodeLoading(true)
    try {
        const data = await verifyEmail({ email, code })
        completeVerification(data)
        setShowModal(false)
        navigate('/')
    } catch (err) {
        if (err.response?.data?.message === 'Account already verified') {
            setShowModal(false)
            navigate('/')
            return
        }
        setCodeError(err.response?.data?.message || 'Invalid code')
    } finally {
        setCodeLoading(false)
    }
}

    const handleResend = async () => {
        setResendSuccess('')
        setCodeError('')
        setResending(true)
        try {
            await resendCode(email)
            setResendSuccess('New code sent!')
        } catch (err) {
            setCodeError(err.response?.data?.message || 'Failed to resend')
        } finally {
            setResending(false)
        }
    }

    return (
        <>
            <div className='form-container'>
                <h2>Welcome Back</h2>
                {error && <div className='form-error'>{error}</div>}
                <form onSubmit={handleSubmit}>
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
                        <div className='password-field'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder='Enter your password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type='button'
                                className='password-toggle'
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>
                    <button type='submit' className='form-submit' disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className='form-footer'>
                    Don't have an account? <Link to='/register'>Register</Link>
                </div>
            </div>

            {showModal && (
                <div className='modal-overlay'>
                    <div className='modal'>
                        <h3>Verify Your Email</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Your account is not verified yet. We sent a code to <strong>{email}</strong>.
                        </p>
                        {codeError && <div className='form-error'>{codeError}</div>}
                        {resendSuccess && (
                            <div style={{ background: '#d3f9d8', color: '#2f9e44', padding: '0.6rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                                {resendSuccess}
                            </div>
                        )}
                        <form onSubmit={handleVerify}>
                            <div className='form-group'>
                                <input
                                    type='text'
                                    placeholder='Enter 6-digit code'
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    maxLength={6}
                                    required
                                    style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.4em', fontWeight: 700 }}
                                />
                            </div>
                            <button type='submit' className='form-submit' disabled={codeLoading}>
                                {codeLoading ? 'Verifying...' : 'Verify Account'}
                            </button>
                        </form>
                        <div className='form-footer'>
                            Didn't receive it?{' '}
                            <button
                                onClick={handleResend}
                                disabled={resending}
                                style={{ background: 'none', border: 'none', color: 'var(--blue-dark)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }}
                            >
                                {resending ? 'Sending...' : 'Resend Code'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Login