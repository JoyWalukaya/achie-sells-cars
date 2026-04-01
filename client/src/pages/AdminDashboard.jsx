import { useState, useEffect } from 'react'
import { getCars, deleteCar, createCar, updateCar } from '../api/cars.js'
import Loader from '../components/Loader.jsx'

const emptyForm = {
    title: '', make: '', model: '', year: '', price: '',
    condition: 'used', bodyType: 'sedan', fuelType: 'petrol',
    transmission: 'automatic', mileage: '', color: '',
    description: '', videoUrl: '', stock: 1, isFeatured: false
}

const AdminDashboard = () => {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingCar, setEditingCar] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [images, setImages] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        fetchCars()
    }, [])

    const fetchCars = async () => {
        try {
            const data = await getCars({ limit: 100 })
            setCars(data.cars)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setForm({ ...form, [e.target.name]: value })
    }

    const handleEdit = (car) => {
        setEditingCar(car)
        setForm({
            title: car.title,
            make: car.make,
            model: car.model,
            year: car.year,
            price: car.price,
            condition: car.condition,
            bodyType: car.bodyType,
            fuelType: car.fuelType,
            transmission: car.transmission,
            mileage: car.mileage,
            color: car.color,
            description: car.description,
            videoUrl: car.videoUrl || '',
            stock: car.stock,
            isFeatured: car.isFeatured
        })
        setShowForm(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this car?')) return
        try {
            await deleteCar(id)
            setCars(cars.filter(car => car._id !== id))
            setSuccess('Car deleted successfully')
            setTimeout(() => setSuccess(''), 3000)
        } catch (error) {
            setError('Failed to delete car')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSubmitting(true)

        try {
            const formData = new FormData()
            Object.entries(form).forEach(([key, value]) => {
                formData.append(key, value)
            })
            images.forEach(image => {
                formData.append('images', image)
            })

            if (editingCar) {
                const updated = await updateCar(editingCar._id, formData)
                setCars(cars.map(car => car._id === editingCar._id ? updated : car))
                setSuccess('Car updated successfully')
            } else {
                const newCar = await createCar(formData)
                setCars([newCar, ...cars])
                setSuccess('Car added successfully')
            }

            setForm(emptyForm)
            setImages([])
            setEditingCar(null)
            setShowForm(false)
            setTimeout(() => setSuccess(''), 3000)
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong')
        } finally {
            setSubmitting(false)
        }
    }

    const handleCancel = () => {
        setForm(emptyForm)
        setImages([])
        setEditingCar(null)
        setShowForm(false)
        setError('')
    }

    if (loading) return <Loader />

    return (
        <div className='page-container'>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 className='page-title' style={{ margin: 0 }}>Admin Dashboard</h1>
                {!showForm && (
                    <button className='btn btn-primary' onClick={() => setShowForm(true)}>
                        Add New Car
                    </button>
                )}
            </div>

            {success && (
                <div style={{ background: '#d3f9d8', color: '#2f9e44', padding: '0.8rem 1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    {success}
                </div>
            )}

            {showForm && (
                <div className='admin-form-container'>
                    <h2>{editingCar ? 'Edit Car' : 'Add New Car'}</h2>
                    {error && <div className='form-error'>{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className='admin-form-grid'>
                            <div className='form-group'>
                                <label>Title</label>
                                <input name='title' value={form.title} onChange={handleChange} required placeholder='e.g. 2021 Toyota Prado TX' />
                            </div>
                            <div className='form-group'>
                                <label>Make</label>
                                <input name='make' value={form.make} onChange={handleChange} required placeholder='e.g. Toyota' />
                            </div>
                            <div className='form-group'>
                                <label>Model</label>
                                <input name='model' value={form.model} onChange={handleChange} required placeholder='e.g. Prado TX' />
                            </div>
                            <div className='form-group'>
                                <label>Year</label>
                                <input type='number' name='year' value={form.year} onChange={handleChange} required placeholder='e.g. 2021' />
                            </div>
                            <div className='form-group'>
                                <label>Price (KES)</label>
                                <input type='number' name='price' value={form.price} onChange={handleChange} required placeholder='e.g. 4500000' />
                            </div>
                            <div className='form-group'>
                                <label>Condition</label>
                                <select name='condition' value={form.condition} onChange={handleChange}>
                                    <option value='new'>New</option>
                                    <option value='used'>Used</option>
                                </select>
                            </div>
                            <div className='form-group'>
                                <label>Body Type</label>
                                <select name='bodyType' value={form.bodyType} onChange={handleChange}>
                                    <option value='sedan'>Sedan</option>
                                    <option value='suv'>SUV</option>
                                    <option value='truck'>Truck</option>
                                    <option value='coupe'>Coupe</option>
                                    <option value='hatchback'>Hatchback</option>
                                    <option value='van'>Van</option>
                                    <option value='convertible'>Convertible</option>
                                </select>
                            </div>
                            <div className='form-group'>
                                <label>Fuel Type</label>
                                <select name='fuelType' value={form.fuelType} onChange={handleChange}>
                                    <option value='petrol'>Petrol</option>
                                    <option value='diesel'>Diesel</option>
                                    <option value='electric'>Electric</option>
                                    <option value='hybrid'>Hybrid</option>
                                </select>
                            </div>
                            <div className='form-group'>
                                <label>Transmission</label>
                                <select name='transmission' value={form.transmission} onChange={handleChange}>
                                    <option value='automatic'>Automatic</option>
                                    <option value='manual'>Manual</option>
                                </select>
                            </div>
                            <div className='form-group'>
                                <label>Mileage (km)</label>
                                <input type='number' name='mileage' value={form.mileage} onChange={handleChange} required placeholder='e.g. 45000' />
                            </div>
                            <div className='form-group'>
                                <label>Color</label>
                                <input name='color' value={form.color} onChange={handleChange} required placeholder='e.g. Pearl White' />
                            </div>
                            <div className='form-group'>
                                <label>Stock</label>
                                <input type='number' name='stock' value={form.stock} onChange={handleChange} required />
                            </div>
                            <div className='form-group'>
                                <label>Video URL (TikTok/YouTube)</label>
                                <input name='videoUrl' value={form.videoUrl} onChange={handleChange} placeholder='https://tiktok.com/...' />
                            </div>
                            <div className='form-group'>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input type='checkbox' name='isFeatured' checked={form.isFeatured} onChange={handleChange} />
                                    Featured on homepage
                                </label>
                            </div>
                        </div>

                        <div className='form-group'>
                            <label>Description</label>
                            <textarea name='description' value={form.description} onChange={handleChange} required placeholder='Describe the car...' rows={4} />
                        </div>

                        <div className='form-group'>
                            <label>Images (max 10)</label>
                            <input
                                type='file'
                                multiple
                                accept='image/*'
                                onChange={(e) => setImages(Array.from(e.target.files))}
                            />
                            {images.length > 0 && (
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.3rem' }}>
                                    {images.length} image(s) selected
                                </p>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type='submit' className='btn btn-primary' disabled={submitting}>
                                {submitting ? 'Saving...' : editingCar ? 'Update Car' : 'Add Car'}
                            </button>
                            <button type='button' className='btn btn-outline' onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className='admin-cars-list'>
                {cars.map(car => (
                    <div key={car._id} className='admin-car-item'>
                        <div className='admin-car-image'>
                            {car.images && car.images.length > 0 ? (
                                <img src={car.images[0]} alt={car.title} />
                            ) : (
                                <div className='car-card-image-placeholder' style={{ height: '80px', fontSize: '2rem' }}>🚗</div>
                            )}
                        </div>
                        <div className='admin-car-info'>
                            <h3>{car.title}</h3>
                            <p>KES {car.price.toLocaleString()} • {car.year} • {car.condition} • Stock: {car.stock}</p>
                        </div>
                        <div className='admin-car-actions'>
                            <button className='btn btn-outline' onClick={() => handleEdit(car)}>Edit</button>
                            <button className='btn btn-primary' style={{ background: '#c92a2a', borderColor: '#c92a2a' }} onClick={() => handleDelete(car._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AdminDashboard