import { useState, useEffect, useRef } from 'react'
import { getCars, deleteCar, createCar, updateCar } from '../api/cars.js'
import Loader from '../components/Loader.jsx'
import API from '../api/axios.js'

const emptyForm = {
    title: '', make: '', model: '', year: '', price: '',
    condition: 'locally used', bodyType: 'sedan', fuelType: 'petrol',
    transmission: 'automatic', mileage: '', color: '', cc: '',
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
    const [analytics, setAnalytics] = useState(null)
    const formRef = useRef(null)
    
    useEffect(() => {
    fetchCars()
    fetchAnalytics()
}, [])

   useEffect(() => {
    if (showForm && formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}, [showForm])

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

    const fetchAnalytics = async () => {
        try {
            const response = await API.get('/analytics')
            setAnalytics(response.data)
        } catch (error) {
            console.log(error)
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
            mileage: car.mileage || '',
            color: car.color,
            cc: car.cc || '',
            description: car.description,
            videoUrl: car.videoUrl || '',
            stock: car.stock,
            isFeatured: car.isFeatured
        })
        setShowForm(true)
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

            {/* TOP BAR */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 className='page-title' style={{ margin: 0 }}>Admin Dashboard</h1>
                {!showForm && (
                    <button className='btn btn-primary' onClick={() => {
                       setShowForm(true)
                      }}>
                          Add New Car
                    </button>
                )}
            </div>

            {/* SUCCESS MESSAGE */}
            {success && (
                <div style={{ background: '#d3f9d8', color: '#2f9e44', padding: '0.8rem 1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    {success}
                </div>
            )}

            {/* ANALYTICS */}
            {analytics && (
                <div className='analytics-container'>
                    <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Site Analytics</h2>

                    <div className='analytics-stats'>
                        <div className='analytics-stat'>
                            <span className='analytics-stat-number'>{analytics.stats.totalUsers}</span>
                            <span className='analytics-stat-label'>Total Customers</span>
                        </div>
                        <div className='analytics-stat'>
                            <span className='analytics-stat-number'>{analytics.stats.totalCars}</span>
                            <span className='analytics-stat-label'>Total Cars</span>
                        </div>
                        <div className='analytics-stat'>
                            <span className='analytics-stat-number'>{analytics.stats.inStockCars}</span>
                            <span className='analytics-stat-label'>In Stock</span>
                        </div>
                        <div className='analytics-stat'>
                            <span className='analytics-stat-number'>{analytics.stats.soldOutCars}</span>
                            <span className='analytics-stat-label'>Sold Out</span>
                        </div>
                    </div>

                    {/* MOST VIEWED CARS */}
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Most Viewed Cars</h3>
                    <div style={{ marginBottom: '2rem' }}>
                        {analytics.mostViewedCars.map(car => (
                            <div key={car._id} className='analytics-car-row'>
                                <span className='analytics-car-name'>{car.title}</span>
                                <span className='analytics-car-views'>{car.views} views</span>
                            </div>
                        ))}
                    </div>

                    {/* REGISTERED CUSTOMERS */}
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Registered Customers</h3>
                    <div style={{ marginBottom: '2rem' }}>
                        {analytics.recentUsers.map(user => (
                            <div key={user._id} className='analytics-user-card'>
                                <div className='analytics-user-header'>
                                    <div>
                                        <p className='analytics-user-name'>{user.name}</p>
                                        <p className='analytics-user-email'>{user.email}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p className='analytics-user-date'>
                                            Joined {new Date(user.createdAt).toLocaleDateString('en-KE', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                        <p className='analytics-user-views'>
                                            {user.viewedCars.length} cars viewed
                                        </p>
                                    </div>
                                </div>

                                {user.viewedCars.length > 0 && (
                                    <div className='analytics-user-activity'>
                                        <p className='analytics-activity-label'>Viewing History</p>
                                        <div className='analytics-activity-list'>
                                            {user.viewedCars.slice().reverse().slice(0, 5).map((v, i) => (
                                                v.car && (
                                                    <div key={i} className='analytics-activity-item'>
                                                        <span className='analytics-activity-car'>
                                                            {v.car.year} {v.car.make} {v.car.model}
                                                        </span>
                                                        <span className='analytics-activity-time'>
                                                            {new Date(v.viewedAt).toLocaleDateString('en-KE', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </span>
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {analytics.recentUsers.length === 0 && (
                            <p style={{ color: 'var(--text-muted)' }}>No registered customers yet</p>
                        )}
                    </div>

                    {/* GUEST VISITS */}
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Guest Traffic</h3>
                    <div className='analytics-user-card'>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                            Guest visits are counted in each car's view count above. Views from unregistered visitors are included in the total views per car. To see exactly which cars guests viewed most, refer to the Most Viewed Cars section — all views including guests are counted there.
                        </p>
                    </div>
                </div>
            )}

            {/* ADD / EDIT FORM */}
            {showForm && (
                    <div className='admin-form-container' ref={formRef}>
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
                                    <option value='locally used'>Locally Used</option>
                                    <option value='fresh import'>Fresh Import</option>
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
                                <label>Mileage (km) — optional</label>
                                <input type='number' name='mileage' value={form.mileage} onChange={handleChange} placeholder='e.g. 45000' />
                            </div>
                            <div className='form-group'>
                                <label>Engine CC</label>
                                <input name='cc' value={form.cc} onChange={handleChange} placeholder='e.g. 2000' />
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
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
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

            {/* CARS LIST */}
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>All Cars ({cars.length})</h3>
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
                            <p>KES {car.price.toLocaleString()} • {car.year} • {car.condition} • Stock: {car.stock} • {car.views} views</p>
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