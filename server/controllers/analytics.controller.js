import User from '../models/user.model.js'
import Car from '../models/car.model.js'

export const getAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'customer' })
        const totalCars = await Car.countDocuments()
        const soldOutCars = await Car.countDocuments({ stock: 0 })

        const recentUsers = await User.find({ role: 'customer' })
            .select('name email createdAt viewedCars')
            .sort({ createdAt: -1 })
            .limit(20)
            .populate('viewedCars.car', 'title make model year')

        const mostViewedCars = await Car.find()
            .select('title make model year views')
            .sort({ views: -1 })
            .limit(10)

        res.json({
            stats: {
                totalUsers,
                totalCars,
                soldOutCars,
                inStockCars: totalCars - soldOutCars
            },
            recentUsers,
            mostViewedCars
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}