import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getCars } from '../api/cars.js'
import CarCard from '../components/CarCard.jsx'
import Filters from '../components/Filters.jsx'
import Loader from '../components/Loader.jsx'

const CarListing = () => {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalCars, setTotalCars] = useState(0)
    const [activeFilters, setActiveFilters] = useState({})
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const search = searchParams.get('search')
        if (search) {
            setActiveFilters({ search })
            fetchCars({ search })
        } else {
            fetchCars({})
        }
    }, [])

    const fetchCars = async (filters = {}, page = 1) => {
        try {
            setLoading(true)
            const data = await getCars({ ...filters, page, limit: 12 })
            setCars(data.cars)
            setCurrentPage(data.currentPage)
            setTotalPages(data.totalPages)
            setTotalCars(data.totalCars)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleFilter = (filters) => {
        setActiveFilters(filters)
        setCurrentPage(1)
        fetchCars(filters, 1)
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
        fetchCars(activeFilters, page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className='page-container'>

            <div className='listing-layout'>
                <Filters
                    onFilter={handleFilter}
                    initialFilters={activeFilters}
                />

                <div className='listing-main'>
                    {loading ? (
                        <Loader />
                    ) : cars.length > 0 ? (
                        <>
                            <div className='cars-grid'>
                                {cars.map(car => (
                                    <CarCard key={car._id} car={car} />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className='pagination'>
                                    <button
                                        className='btn btn-outline'
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>

                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                                            onClick={() => handlePageChange(i + 1)}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button
                                        className='btn btn-outline'
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <p style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}>
                                No cars found matching your filters
                            </p>
                            <button
                                className='btn btn-primary'
                                style={{ marginTop: '1rem' }}
                                onClick={() => handleFilter({})}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CarListing