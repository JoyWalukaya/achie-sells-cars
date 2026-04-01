import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import logo from '../assets/logo.png'

const Navbar = () => {
    const { isLoggedIn, isAdmin, user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <nav className='navbar'>
            <div className='navbar-container'>
                <Link to='/' className='navbar-logo'>
    <img src={logo} alt='Achie Sells Cars' style={{ height: '65px', objectFit: 'contain' }} />
</Link>

                <div className='navbar-links'>
                    <Link to='/cars'>Browse Cars</Link>

                    {isLoggedIn ? (
                        <>
                            <Link to='/saved'>Saved Cars</Link>
                            {isAdmin && (
                                <Link to='/admin'>Admin</Link>
                            )}
                            <div className='navbar-user'>
                                <span>Hi, {user.name.split(' ')[0]}</span>
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to='/login'>Login</Link>
                            <Link to='/register' className='navbar-register'>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar