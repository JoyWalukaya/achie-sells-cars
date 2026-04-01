import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCar, saveCar } from '../api/cars.js'
import { useAuth } from '../context/AuthContext.jsx'
import Loader from '../components/Loader.jsx'

const CarDetail = () => {
    const { id } = useParams()
    const [car, setCar] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saved, setSaved] = useState(false)
    const [activeImage, setActiveImage] = useState(0)
    const { isLoggedIn, isAdmin } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const data = await getCar(id)
                setCar(data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchCar()
    }, [id])

    const handleSave = async () => {
        if (!isLoggedIn) return navigate('/login')
        try {
            const result = await saveCar(id)
            setSaved(result.saved)
        } catch (error) {
            console.log(error)
        }
    }

    if (loading) return <Loader />
    if (!car) return <div className='page-container'>Car not found</div>

    const whatsappMessage = `Hi, I'm interested in the ${car.year} ${car.make} ${car.model} you listed on Achie Sells Cars.`
    const whatsappLink = `https://wa.me/254700000000?text=${encodeURIComponent(whatsappMessage)}`

    const formatPrice = (price) => new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0
    }).format(price)

    const getTikTokEmbedId = (url) => {
        if (!url) return null
        const match = url.match(/video\/(\d+)/)
        return match ? match[1] : null
    }

    const videoId = getTikTokEmbedId(car.videoUrl)

    return (
        <div className='page-container'>
            <button
                className='btn btn-outline'
                onClick={() => navigate(-1)}
                style={{ marginBottom: '1.5rem' }}
            >
                Back
            </button>

            <div className='car-detail-layout'>
                {/* LEFT — Images */}
                <div className='car-detail-images'>
                    <div className='car-detail-main-image'>
                        {car.images && car.images.length > 0 ? (
                            <img src={car.images[activeImage]} alt={car.title} />
                        ) : (
                            <div className='car-card-image-placeholder' style={{ height: '400px', fontSize: '5rem' }}>
                                🚗
                            </div>
                        )}
                    </div>

                    {car.images && car.images.length > 1 && (
                        <div className='car-detail-thumbnails'>
                            {car.images.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt={`${car.title} ${i + 1}`}
                                    className={activeImage === i ? 'active' : ''}
                                    onClick={() => setActiveImage(i)}
                                />
                            ))}
                        </div>
                    )}

                    {car.videoUrl && (
                        <div className='car-detail-video'>
                            <h3>Watch Video</h3>
                            {videoId ? (
                                <blockquote
                                    className='tiktok-embed'
                                    cite={car.videoUrl}
                                    data-video-id={videoId}
                                >
                                    <a href={car.videoUrl} target='_blank' rel='noreferrer'>
                                        Watch on TikTok
                                    </a>
                                </blockquote>
                            ) : (
                                
                                 <a href={car.videoUrl}
                                    target='_blank'
                                    rel='noreferrer'
                                    className='btn btn-secondary'
                                >
                                    Watch Video
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {/* RIGHT — Details */}
                <div className='car-detail-info'>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h1 className='car-detail-title'>{car.title}</h1>
                        {isLoggedIn && (
                            <button
                                onClick={handleSave}
                                style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                {saved ? '❤️' : '🤍'}
                            </button>
                        )}
                    </div>

                    <p className='car-detail-price'>{formatPrice(car.price)}</p>

                    <div className='car-detail-stock'>
                        {car.stock > 0 ? (
                            <span style={{ color: '#2f9e44' }}>✓ {car.stock} in stock</span>
                        ) : (
                            <span style={{ color: 'var(--text-light)' }}>Out of stock</span>
                        )}
                    </div>

                    <div className='car-detail-specs'>
                        <h3>Specifications</h3>
                        <div className='specs-grid'>
                            <div className='spec-item'>
                                <span className='spec-label'>Make</span>
                                <span className='spec-value'>{car.make}</span>
                            </div>
                            <div className='spec-item'>
                                <span className='spec-label'>Model</span>
                                <span className='spec-value'>{car.model}</span>
                            </div>
                            <div className='spec-item'>
                                <span className='spec-label'>Year</span>
                                <span className='spec-value'>{car.year}</span>
                            </div>
                            <div className='spec-item'>
                                <span className='spec-label'>Condition</span>
                                <span className='spec-value'>{car.condition}</span>
                            </div>
                            <div className='spec-item'>
                                <span className='spec-label'>Body Type</span>
                                <span className='spec-value'>{car.bodyType}</span>
                            </div>
                            <div className='spec-item'>
                                <span className='spec-label'>Fuel Type</span>
                                <span className='spec-value'>{car.fuelType}</span>
                            </div>
                            <div className='spec-item'>
                                <span className='spec-label'>Transmission</span>
                                <span className='spec-value'>{car.transmission}</span>
                            </div>
                            <div className='spec-item'>
                                <span className='spec-label'>Mileage</span>
                                <span className='spec-value'>{car.mileage.toLocaleString()} km</span>
                            </div>
                            <div className='spec-item'>
                                <span className='spec-label'>Color</span>
                                <span className='spec-value'>{car.color}</span>
                            </div>
                            <div className='spec-item'>
                                <span className='spec-label'>Views</span>
                                <span className='spec-value'>{car.views}</span>
                            </div>
                        </div>
                    </div>

                    <div className='car-detail-description'>
                        <h3>Description</h3>
                        <p>{car.description}</p>
                    </div>

                    <div className='car-detail-actions'>
                        
                          <a  href={whatsappLink}
                            target='_blank'
                            rel='noreferrer'
                            className='btn btn-whatsapp'
                            style={{ flex: 1, textAlign: 'center', padding: '0.8rem' }}
                        >
                            WhatsApp Inquiry
                        </a>
                        
                           <a href='tel:+254700000000'
                            className='btn btn-call'
                            style={{ flex: 1, textAlign: 'center', padding: '0.8rem' }}
                        >
                            Call Us
                        </a>
                    </div>

                    {isAdmin && (
                        <button
                            className='btn btn-outline'
                            style={{ width: '100%', marginTop: '1rem' }}
                            onClick={() => navigate('/admin')}
                        >
                            Edit in Admin Panel
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CarDetail