import express from 'express'
import {
    getCars,
    getCar,
    getFeaturedCars,
    getRecommendedCars,
    createCar,
    updateCar,
    deleteCar,
    saveCar,
    getSavedCars
} from '../controllers/car.controller.js'
import { protect, adminOnly } from '../middleware/auth.middleware.js'
import { uploadImages } from '../middleware/upload.middleware.js'

const router = express.Router()

router.get('/', getCars)
router.get('/featured', getFeaturedCars)
router.get('/saved', protect, getSavedCars)
router.get('/recommended', protect, getRecommendedCars)
router.get('/:id', getCar)
router.post('/', protect, adminOnly, uploadImages, createCar)
router.put('/:id', protect, adminOnly, uploadImages, updateCar)
router.delete('/:id', protect, adminOnly, deleteCar)
router.post('/:id/save', protect, saveCar)

export default router