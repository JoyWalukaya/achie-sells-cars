import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import logo from '../assets/logo.png'

const Navbar = ({ isHome }) => {
    const { isLoggedIn, isAdmin, user, logout } = useAuth()
    const { darkMode, toggleTheme } = useTheme()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <nav className={`navbar ${isHome ? 'navbar-home' : 'navbar-page'}`}>
            <div className='navbar-inner'>
                <div className='navbar-left'>
                    <Link to='/'>
                        <img
                            src={logo}
                            alt='Achie Sells Cars'
                            className='navbar-logo'
                        />
                    </Link>
                    <div className='navbar-links'>
                        <Link to='/'>Home</Link>
                        <Link to='/cars'>Cars</Link>
                        <Link to='/contact'>Contact</Link>
                        {isLoggedIn && (
                            <Link to='/saved'>Saved</Link>
                        )}
                    </div>
                </div>

                <div className='navbar-right'>
                    <button
                        className='theme-toggle'
                        onClick={toggleTheme}
                        title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {darkMode ? '☀️' : '🌙'}
                    </button>

                    {isLoggedIn ? (
                        <>
                            <span className='navbar-greeting'>
                                Hi, {user.name.split(' ')[0]}
                            </span>
                            {isAdmin && (
                                <Link to='/admin' className='navbar-admin-btn'>
                                    Admin
                                </Link>
                            )}
                            <button
                                className='navbar-btn navbar-btn-outline'
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to='/login' className='navbar-btn navbar-btn-ghost'>
                                Login
                            </Link>
                            <Link to='/register' className='navbar-btn navbar-btn-solid'>
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar