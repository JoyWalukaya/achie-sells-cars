import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFeaturedCars } from '../api/cars.js'
import CarCard from '../components/CarCard.jsx'
import Loader from '../components/Loader.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const Home = () => {
    const [featuredCars, setFeaturedCars] = useState([])
    const [recommendedCars, setRecommendedCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const { isLoggedIn } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const featured = await getFeaturedCars()
                setFeaturedCars(featured)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchCars()
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        if (search.trim()) {
            navigate(`/cars?search=${search}`)
        }
    }

    return (
        <div>
            {/* HERO */}
            <div className='hero'>
                <h1>Find Your Dream Car</h1>
                <p>Browse our collection of quality vehicles at the best prices</p>

                <form className='hero-search' onSubmit={handleSearch}>
                    <input
                        type='text'
                        placeholder='Search by make, model...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type='submit'>Search</button>
                </form>

                <div className='hero-actions'>
                    <button
                        className='btn btn-primary'
                        onClick={() => navigate('/cars')}
                    >
                        Browse All Cars
                    </button>
                    {!isLoggedIn && (
                        <button
                            className='btn btn-outline'
                            style={{ color: 'white', borderColor: 'white' }}
                            onClick={() => navigate('/register')}
                        >
                            Create Account
                        </button>
                    )}
                </div>
            </div>

            {/* FEATURED CARS */}
            <div className='section'>
                <div className='section-container'>
                    <h2 className='section-title'>Featured Cars</h2>
                    {loading ? (
                        <Loader />
                    ) : featuredCars.length > 0 ? (
                        <div className='cars-grid'>
                            {featuredCars.map(car => (
                                <CarCard key={car._id} car={car} />
                            ))}
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: 'var(--text-light)' }}>
                            No featured cars yet
                        </p>
                    )}
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <button
                            className='btn btn-secondary'
                            onClick={() => navigate('/cars')}
                        >
                            View All Cars
                        </button>
                    </div>
                </div>
            </div>

            {/* WHY CHOOSE US */}
            <div className='section' style={{ backgroundColor: 'var(--background)' }}>
                <div className='section-container'>
                    <h2 className='section-title'>Why Choose Achie Sells Cars?</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '2rem',
                        marginTop: '1rem'
                    }}>
                        {[
                            { icon: '✅', title: 'Verified Cars', desc: 'Every car is thoroughly inspected before listing' },
                            { icon: '💰', title: 'Best Prices', desc: 'Competitive prices with no hidden charges' },
                            { icon: '🤝', title: 'Trusted Dealer', desc: 'Years of experience in the car industry' },
                            { icon: '📱', title: 'Easy Contact', desc: 'Reach us instantly via WhatsApp or call' }
                        ].map((item, index) => (
                            <div key={index} style={{
                                textAlign: 'center',
                                padding: '1.5rem',
                                backgroundColor: 'var(--white)',
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: 'var(--shadow)'
                            }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.icon}</div>
                                <h3 style={{ marginBottom: '0.5rem', color: 'var(--secondary)' }}>{item.title}</h3>
                                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CONTACT SECTION */}
            <div className='section section-dark'>
                <div className='section-container' style={{ textAlign: 'center' }}>
                    <h2 className='section-title'>Interested in a Car?</h2>
                    <p style={{ marginBottom: '1.5rem', opacity: 0.9 }}>
                        Contact us today and we'll help you find your perfect car
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        
                            <a href='https://wa.me/254700000000'
                            target='_blank'
                            rel='noreferrer'
                            className='btn btn-whatsapp'
                        >
                            💬 WhatsApp Us
                        </a>
                        
                           <a href='tel:+254700000000'
                            className='btn btn-call'
                        >
                            📞 Call Us
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home