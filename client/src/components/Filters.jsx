import { useState } from 'react'

const Filters = ({ onFilter, initialFilters = {} }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [filters, setFilters] = useState({
        search: initialFilters.search || '',
        make: initialFilters.make || '',
        condition: initialFilters.condition || '',
        bodyType: initialFilters.bodyType || '',
        fuelType: initialFilters.fuelType || '',
        transmission: initialFilters.transmission || '',
        minYear: initialFilters.minYear || '',
        maxYear: initialFilters.maxYear || '',
        minPrice: initialFilters.minPrice || '',
        maxPrice: initialFilters.maxPrice || '',
        minMileage: initialFilters.minMileage || '',
        maxMileage: initialFilters.maxMileage || '',
    })

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== '')
        )
        onFilter(cleanFilters)
        setIsOpen(false)
    }

    const handleReset = () => {
        setFilters({
            search: '',
            make: '',
            condition: '',
            bodyType: '',
            fuelType: '',
            transmission: '',
            minYear: '',
            maxYear: '',
            minPrice: '',
            maxPrice: '',
            minMileage: '',
            maxMileage: '',
        })
        onFilter({})
        setIsOpen(false)
    }

    const activeFilterCount = Object.values(filters).filter(v => v !== '').length

    return (
        <div className='filters-container'>
            <button
                className='filters-toggle'
                onClick={() => setIsOpen(!isOpen)}
                type='button'
            >
                <span>
                    Filters {activeFilterCount > 0 && (
                        <span className='filters-badge'>{activeFilterCount}</span>
                    )}
                </span>
                <span>{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div className='filters-dropdown'>
                    <form onSubmit={handleSubmit}>
                        <div className='filters-grid'>
                            <div className='form-group'>
                                <label>Search</label>
                                <input
                                    type='text'
                                    name='search'
                                    placeholder='Make, model...'
                                    value={filters.search}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='form-group'>
                                <label>Make</label>
                                <input
                                    type='text'
                                    name='make'
                                    placeholder='e.g. Toyota'
                                    value={filters.make}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='form-group'>
                                <label>Condition</label>
                                <select name='condition' value={filters.condition} onChange={handleChange}>
                                    <option value=''>All</option>
                                    <option value='new'>New</option>
                                    <option value='used'>Used</option>
                                </select>
                            </div>

                            <div className='form-group'>
                                <label>Body Type</label>
                                <select name='bodyType' value={filters.bodyType} onChange={handleChange}>
                                    <option value=''>All</option>
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
                                <select name='fuelType' value={filters.fuelType} onChange={handleChange}>
                                    <option value=''>All</option>
                                    <option value='petrol'>Petrol</option>
                                    <option value='diesel'>Diesel</option>
                                    <option value='electric'>Electric</option>
                                    <option value='hybrid'>Hybrid</option>
                                </select>
                            </div>

                            <div className='form-group'>
                                <label>Transmission</label>
                                <select name='transmission' value={filters.transmission} onChange={handleChange}>
                                    <option value=''>All</option>
                                    <option value='automatic'>Automatic</option>
                                    <option value='manual'>Manual</option>
                                </select>
                            </div>

                            <div className='form-group'>
                                <label>Min Year</label>
                                <input
                                    type='number'
                                    name='minYear'
                                    placeholder='e.g. 2015'
                                    value={filters.minYear}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='form-group'>
                                <label>Max Year</label>
                                <input
                                    type='number'
                                    name='maxYear'
                                    placeholder='e.g. 2024'
                                    value={filters.maxYear}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='form-group'>
                                <label>Min Price (KES)</label>
                                <input
                                    type='number'
                                    name='minPrice'
                                    placeholder='e.g. 500000'
                                    value={filters.minPrice}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='form-group'>
                                <label>Max Price (KES)</label>
                                <input
                                    type='number'
                                    name='maxPrice'
                                    placeholder='e.g. 5000000'
                                    value={filters.maxPrice}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='form-group'>
                                <label>Min Mileage (km)</label>
                                <input
                                    type='number'
                                    name='minMileage'
                                    placeholder='e.g. 0'
                                    value={filters.minMileage}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='form-group'>
                                <label>Max Mileage (km)</label>
                                <input
                                    type='number'
                                    name='maxMileage'
                                    placeholder='e.g. 100000'
                                    value={filters.maxMileage}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className='filters-actions'>
                            <button
                                type='button'
                                className='btn btn-outline'
                                onClick={handleReset}
                            >
                                Reset
                            </button>
                            <button type='submit' className='btn btn-primary'>
                                Apply Filters
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default Filters