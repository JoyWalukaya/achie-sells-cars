import { useState, useEffect } from 'react'
import { getSavedCars } from '../api/cars.js'
import CarCard from '../components/CarCard.jsx'
import Loader from '../components/Loader.jsx'

const SavedCars = () => {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSaved = async () => {
            try {
                const data = await getSavedCars()
                setCars(data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchSaved()
    }, [])

    const handleSaveToggle = (carId) => {
        setCars(cars.filter(car => car._id !== carId))
    }

    if (loading) return <Loader />

    return (
        <div className='page-container'>
            <h1 className='page-title'>Saved Cars</h1>
            {cars.length > 0 ? (
                <div className='cars-grid'>
                    {cars.map(car => (
                        <CarCard
                            key={car._id}
                            car={car}
                            onSaveToggle={handleSaveToggle}
                        />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}>
                        No saved cars yet
                    </p>
                </div>
            )}
        </div>
    )
}

export default SavedCars