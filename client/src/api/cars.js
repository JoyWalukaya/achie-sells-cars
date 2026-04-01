import API from './axios.js'

export const getCars = async (filters = {}) => {
    const response = await API.get('/cars', { params: filters })
    return response.data
}

export const getCar = async (id) => {
    const response = await API.get(`/cars/${id}`)
    return response.data
}

export const getFeaturedCars = async () => {
    const response = await API.get('/cars/featured')
    return response.data
}

export const getRecommendedCars = async () => {
    const response = await API.get('/cars/recommended')
    return response.data
}

export const getSavedCars = async () => {
    const response = await API.get('/cars/saved')
    return response.data
}

export const saveCar = async (id) => {
    const response = await API.post(`/cars/${id}/save`)
    return response.data
}

export const createCar = async (carData) => {
    const response = await API.post('/cars', carData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
}

export const updateCar = async (id, carData) => {
    const response = await API.put(`/cars/${id}`, carData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
}

export const deleteCar = async (id) => {
    const response = await API.delete(`/cars/${id}`)
    return response.data
}