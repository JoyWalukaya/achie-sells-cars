import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { saveCar } from '../api/cars.js'
import { useState } from 'react'

const CarCard = ({ car, onSaveToggle }) => {
    const { isLoggedIn } = useAuth()
    const [saved, setSaved] = useState(false)
    const [saving, setSaving] = useState(false)

    const handleSave = async (e) => {
        e.preventDefault()
        if (!isLoggedIn) return
        try {
            setSaving(true)
            const result = await saveCar(car._id)
            setSaved(result.saved)
            if (onSaveToggle) onSaveToggle(car._id)
        } catch (error) {
            console.log(error)
        } finally {
            setSaving(false)
        }
    }

    const whatsappMessage = `Hi, I'm interested in the ${car.year} ${car.make} ${car.model} you listed on Achie Sells Cars.`
    const whatsappLink = `https://wa.me/254700000000?text=${encodeURIComponent(whatsappMessage)}`
    const callLink = `tel:+254700000000`

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0
        }).format(price)
    }

    return (
        <div className='car-card'>
            <div className='car-card-image'>
                {car.images && car.images.length > 0 ? (
                    <img src={car.images[0]} alt={car.title} />
                ) : (
                    <div className='car-card-image-placeholder'>🚗</div>
                )}

                <span className={`car-card-badge badge-${car.condition}`}>
                    {car.condition}
                </span>

                {isLoggedIn && (
                    <button
                        className='car-card-save'
                        onClick={handleSave}
                        disabled={saving}
                        title={saved ? 'Remove from saved' : 'Save car'}
                    >
                        {saved ? '❤️' : '🤍'}
                    </button>
                )}
            </div>

            <div className='car-card-body'>
                <h3 className='car-card-title'>{car.title}</h3>
                <p className='car-card-price'>{formatPrice(car.price)}</p>

                <div className='car-card-details'>
                    <span className='car-card-detail'>📅 {car.year}</span>
                    <span className='car-card-detail'>⛽ {car.fuelType}</span>
                    <span className='car-card-detail'>⚙️ {car.transmission}</span>
                    <span className='car-card-detail'>🛣️ {car.mileage.toLocaleString()} km</span>
                </div>

                <p className={`car-card-stock ${car.stock === 0 ? 'out' : ''}`}>
                    {car.stock > 0 ? `${car.stock} in stock` : 'Out of stock'}
                </p>

                <div className='car-card-actions'>
                    <Link
                        to={`/cars/${car._id}`}
                        className='btn btn-secondary'
                    >
                        View Details
                    </Link>
                    
                        <a href={whatsappLink}
                        target='_blank'
                        rel='noreferrer'
                        className='btn btn-whatsapp'
                    >
                        WhatsApp
                    </a>
                    
                       <a href={callLink}
                        className='btn btn-call'
                    >
                        Call
                    </a>
                </div>
            </div>
        </div>
    )
}

export default CarCard