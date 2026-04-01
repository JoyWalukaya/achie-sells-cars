import Car from '../models/car.model.js'
import User from '../models/user.model.js'

export const getCars = async (req, res) => {
    try {
        const {
            search,
            make,
            model,
            condition,
            bodyType,
            fuelType,
            transmission,
            minYear,
            maxYear,
            minPrice,
            maxPrice,
            minMileage,
            maxMileage,
            page = 1,
            limit = 12
        } = req.query

        const filter = {}

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { make: { $regex: search, $options: 'i' } },
                { model: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        }

        if (make) filter.make = { $regex: make, $options: 'i' }
        if (model) filter.model = { $regex: model, $options: 'i' }
        if (condition) filter.condition = condition
        if (bodyType) filter.bodyType = bodyType
        if (fuelType) filter.fuelType = fuelType
        if (transmission) filter.transmission = transmission

        if (minYear || maxYear) {
            filter.year = {}
            if (minYear) filter.year.$gte = Number(minYear)
            if (maxYear) filter.year.$lte = Number(maxYear)
        }

        if (minPrice || maxPrice) {
            filter.price = {}
            if (minPrice) filter.price.$gte = Number(minPrice)
            if (maxPrice) filter.price.$lte = Number(maxPrice)
        }

        if (minMileage || maxMileage) {
            filter.mileage = {}
            if (minMileage) filter.mileage.$gte = Number(minMileage)
            if (maxMileage) filter.mileage.$lte = Number(maxMileage)
        }

        const skip = (Number(page) - 1) * Number(limit)
        const total = await Car.countDocuments(filter)
        const cars = await Car.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))

        res.json({
            cars,
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            totalCars: total
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id)

        if (!car) {
            return res.status(404).json({ message: 'Car not found' })
        }

        await Car.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } })

        if (req.user) {
            await User.findByIdAndUpdate(req.user._id, {
                $push: {
                    viewedCars: {
                        $each: [{ car: car._id }],
                        $slice: -20
                    }
                }
            })
        }

        res.json(car)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getFeaturedCars = async (req, res) => {
    try {
        const cars = await Car.find({ isFeatured: true }).limit(6)
        res.json(cars)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getRecommendedCars = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('viewedCars.car')

        if (!user || user.viewedCars.length === 0) {
            const cars = await Car.find().sort({ views: -1 }).limit(6)
            return res.json(cars)
        }

        const viewedCarIds = user.viewedCars.map(v => v.car?._id).filter(Boolean)
        const viewedCars = user.viewedCars.map(v => v.car).filter(Boolean)

        const makes = viewedCars.map(c => c.make)
        const bodyTypes = viewedCars.map(c => c.bodyType)

        const recommendations = await Car.find({
            _id: { $nin: viewedCarIds },
            $or: [
                { make: { $in: makes } },
                { bodyType: { $in: bodyTypes } }
            ]
        }).limit(6)

        if (recommendations.length === 0) {
            const cars = await Car.find({ _id: { $nin: viewedCarIds } })
                .sort({ views: -1 })
                .limit(6)
            return res.json(cars)
        }

        res.json(recommendations)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const createCar = async (req, res) => {
    try {
        const {
            title,
            make,
            model,
            year,
            price,
            condition,
            bodyType,
            fuelType,
            transmission,
            mileage,
            color,
            description,
            videoUrl,
            stock,
            isFeatured
        } = req.body

        const images = req.uploadedImages || []

        const car = await Car.create({
            title,
            make,
            model,
            year,
            price,
            condition,
            bodyType,
            fuelType,
            transmission,
            mileage,
            color,
            description,
            videoUrl,
            stock,
            isFeatured,
            images
        })

        res.status(201).json(car)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id)

        if (!car) {
            return res.status(404).json({ message: 'Car not found' })
        }

        const newImages = req.uploadedImages || []
        const existingImages = req.body.existingImages
            ? JSON.parse(req.body.existingImages)
            : car.images

        const updatedCar = await Car.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                images: [...existingImages, ...newImages]
            },
            { new: true }
        )

        res.json(updatedCar)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const deleteCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id)

        if (!car) {
            return res.status(404).json({ message: 'Car not found' })
        }

        await Car.findByIdAndDelete(req.params.id)
        res.json({ message: 'Car deleted successfully' })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const saveCar = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        const carId = req.params.id

        const alreadySaved = user.savedCars.includes(carId)

        if (alreadySaved) {
            await User.findByIdAndUpdate(req.user._id, {
                $pull: { savedCars: carId }
            })
            return res.json({ message: 'Car removed from saved', saved: false })
        }

        await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { savedCars: carId }
        })

        res.json({ message: 'Car saved successfully', saved: true })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getSavedCars = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('savedCars')
        res.json(user.savedCars)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}