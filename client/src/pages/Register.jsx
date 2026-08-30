import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { verifyEmail, resendCode } from '../api/auth.js'

const Register = () => {
    const [name, setName] = useState('')
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
    const { register, completeVerification } = useAuth()
    const navigate = useNavigate()

    const getPasswordStrength = (pass) => {
        if (!pass) return { strength: 0, label: '', color: '' }
        let score = 0
        if (pass.length >= 8) score++
        if (/[A-Z]/.test(pass)) score++
        if (/[a-z]/.test(pass)) score++
        if (/\d/.test(pass)) score++
        if (/[@$!%*?&#]/.test(pass)) score++
        if (score <= 2) return { strength: score, label: 'Weak', color: '#c92a2a' }
        if (score === 3) return { strength: score, label: 'Fair', color: '#f59f00' }
        if (score === 4) return { strength: score, label: 'Good', color: '#2f9e44' }
        return { strength: score, label: 'Strong', color: '#1864ab' }
    }

    const passwordStrength = getPasswordStrength(password)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await register({ name, email, password })
            setShowModal(true)
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed')
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
                        <div className='password-field'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder='At least 8 characters'
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
                        {password && (
                            <div className='password-strength'>
                                <div className='strength-bars'>
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div
                                            key={i}
                                            className='strength-bar'
                                            style={{
                                                backgroundColor: i <= passwordStrength.strength
                                                    ? passwordStrength.color
                                                    : 'var(--border)'
                                            }}
                                        />
                                    ))}
                                </div>
                                <span style={{ fontSize: '0.78rem', color: passwordStrength.color, fontWeight: 600 }}>
                                    {passwordStrength.label}
                                </span>
                            </div>
                        )}
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                            Must include uppercase, lowercase, number and special character (@$!%*?&#)
                        </p>
                    </div>
                    <button type='submit' className='form-submit' disabled={loading}>
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>
                <div className='form-footer'>
                    Already have an account? <Link to='/login'>Login</Link>
                </div>
            </div>

            {showModal && (
                <div className='modal-overlay'>
                    <div className='modal'>
                        <h3>Verify Your Email</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            We sent a 6-digit code to <strong>{email}</strong>. Check your inbox.
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

export default Register