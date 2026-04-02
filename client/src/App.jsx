import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import CarListing from './pages/CarListing.jsx'
import CarDetail from './pages/CarDetail.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import SavedCars from './pages/SavedCars.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

function App() {
    const location = useLocation()
    const isHome = location.pathname === '/'

    return (
        <div className='app'>
            <Navbar isHome={isHome} />
            <main className='main-content'>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/cars' element={<CarListing />} />
                    <Route path='/cars/:id' element={<CarDetail />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/saved' element={
                        <ProtectedRoute>
                            <SavedCars />
                        </ProtectedRoute>
                    } />
                    <Route path='/admin' element={
                        <ProtectedRoute adminOnly>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                </Routes>
            </main>
            {!isHome && <Footer />}
        </div>
    )
}

export default App