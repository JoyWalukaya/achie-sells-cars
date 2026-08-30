import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCar, saveCar } from '../api/cars.js'
import { useAuth } from '../context/AuthContext.jsx'
import Loader from '../components/Loader.jsx'
import { WHATSAPP, CALL , SITE_NAME } from '../config.js'

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

    const whatsappMessage = `Hi, I'm interested in the ${car.year} ${car.make} ${car.model} you listed on ${SITE_NAME}.`
    const whatsappLink = `${WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`

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
                ← Back
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
        
          <a  href={car.videoUrl}
            target='_blank'
            rel='noreferrer'
            className='video-link'
        >
            ▶ Watch Video on TikTok
        </a>
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

                    {/* STOCK — customers see In Stock/Sold Out, admin sees exact number */}
                    <div className='car-detail-stock'>
                        {isAdmin ? (
                            <span style={{ color: car.stock > 0 ? '#2f9e44' : '#c92a2a' }}>
                                {car.stock > 0 ? `${car.stock} in stock` : 'Sold Out'}
                            </span>
                        ) : (
                            <span style={{ color: car.stock > 0 ? '#2f9e44' : '#c92a2a' }}>
                                {car.stock > 0 ? '✓ In Stock' : '✕ Sold Out'}
                            </span>
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
                                <span className='spec-label'>Color</span>
                                <span className='spec-value'>{car.color}</span>
                            </div>
                            {car.cc && (
                                <div className='spec-item'>
                                    <span className='spec-label'>Engine CC</span>
                                    <span className='spec-value'>{car.cc} cc</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='car-detail-description'>
                        <h3>Description</h3>
                        <p>{car.description}</p>
                    </div>

                    <div className='car-detail-actions'>
                        
                           <a href={whatsappLink}
                            target='_blank'
                            rel='noreferrer'
                            className='btn btn-whatsapp'
                            style={{ flex: 1, textAlign: 'center', padding: '0.8rem' }}
                        >
                            💬 WhatsApp Inquiry
                        </a>
                        
                           <a href={CALL}
                            className='btn btn-call'
                            style={{ flex: 1, textAlign: 'center', padding: '0.8rem' }}
                        >
                            📞 Call Us
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