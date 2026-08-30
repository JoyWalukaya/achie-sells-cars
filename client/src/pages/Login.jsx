import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { verifyEmail, resendCode, forgotPassword, resetPassword } from '../api/auth.js'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showVerifyModal, setShowVerifyModal] = useState(false)
    const [showForgotModal, setShowForgotModal] = useState(false)
    const [showResetModal, setShowResetModal] = useState(false)
    const [forgotEmail, setForgotEmail] = useState('')
    const [resetCode, setResetCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [code, setCode] = useState('')
    const [codeError, setCodeError] = useState('')
    const [codeLoading, setCodeLoading] = useState(false)
    const [forgotLoading, setForgotLoading] = useState(false)
    const [resetLoading, setResetLoading] = useState(false)
    const [resending, setResending] = useState(false)
    const [resendSuccess, setResendSuccess] = useState('')
    const [forgotSuccess, setForgotSuccess] = useState('')
    const { login, completeVerification } = useAuth()
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

    const passwordStrength = getPasswordStrength(newPassword)

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
                setShowVerifyModal(true)
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
            setShowVerifyModal(false)
            navigate('/')
        } catch (err) {
            if (err.response?.data?.message === 'Account already verified') {
                setShowVerifyModal(false)
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

    const handleForgotPassword = async (e) => {
        e.preventDefault()
        setForgotSuccess('')
        setCodeError('')
        setForgotLoading(true)
        try {
            await forgotPassword(forgotEmail)
            setForgotSuccess('Reset code sent! Check your email.')
            setShowForgotModal(false)
            setShowResetModal(true)
        } catch (err) {
            setCodeError(err.response?.data?.message || 'Failed to send reset code')
        } finally {
            setForgotLoading(false)
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()
        setCodeError('')
        setResetLoading(true)
        try {
            const data = await resetPassword({ email: forgotEmail, code: resetCode, newPassword })
            completeVerification(data)
            setShowResetModal(false)
            navigate('/')
        } catch (err) {
            setCodeError(err.response?.data?.message || 'Failed to reset password')
        } finally {
            setResetLoading(false)
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
                    <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                        <button
                            type='button'
                            onClick={() => setShowForgotModal(true)}
                            style={{ background: 'none', border: 'none', color: 'var(--blue-dark)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            Forgot password?
                        </button>
                    </div>
                    <button type='submit' className='form-submit' disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className='form-footer'>
                    Don't have an account? <Link to='/register'>Register</Link>
                </div>
            </div>

            {/* VERIFY MODAL */}
            {showVerifyModal && (
                <div className='modal-overlay'>
                    <div className='modal'>
                        <h3>Verify Your Email</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Your account is not verified. We sent a code to <strong>{email}</strong>.
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
                            <button onClick={handleResend} disabled={resending}
                                style={{ background: 'none', border: 'none', color: 'var(--blue-dark)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }}>
                                {resending ? 'Sending...' : 'Resend Code'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* FORGOT PASSWORD MODAL */}
            {showForgotModal && (
                <div className='modal-overlay'>
                    <div className='modal'>
                        <h3>Forgot Password</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Enter your email and we'll send you a reset code.
                        </p>
                        {codeError && <div className='form-error'>{codeError}</div>}
                        <form onSubmit={handleForgotPassword}>
                            <div className='form-group'>
                                <input
                                    type='email'
                                    placeholder='Enter your email'
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button type='submit' className='form-submit' disabled={forgotLoading}>
                                {forgotLoading ? 'Sending...' : 'Send Reset Code'}
                            </button>
                        </form>
                        <div className='form-footer'>
                            <button
                                onClick={() => setShowForgotModal(false)}
                                style={{ background: 'none', border: 'none', color: 'var(--blue-dark)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }}
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* RESET PASSWORD MODAL */}
            {showResetModal && (
                <div className='modal-overlay'>
                    <div className='modal'>
                        <h3>Reset Password</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Enter the code sent to <strong>{forgotEmail}</strong> and your new password.
                        </p>
                        {codeError && <div className='form-error'>{codeError}</div>}
                        <form onSubmit={handleResetPassword}>
                            <div className='form-group'>
                                <label>Reset Code</label>
                                <input
                                    type='text'
                                    placeholder='Enter 6-digit code'
                                    value={resetCode}
                                    onChange={(e) => setResetCode(e.target.value)}
                                    maxLength={6}
                                    required
                                    style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.4em', fontWeight: 700 }}
                                />
                            </div>
                            <div className='form-group'>
                                <label>New Password</label>
                                <div className='password-field'>
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        placeholder='Enter new password'
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type='button'
                                        className='password-toggle'
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                                {newPassword && (
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
                            </div>
                            <button type='submit' className='form-submit' disabled={resetLoading}>
                                {resetLoading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default Login