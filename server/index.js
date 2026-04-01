import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import carRoutes from './routes/car.routes.js'

const app = express()

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Too many requests, please try again later' }
})

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: 'Too many login attempts, please try again later' }
})

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(limiter)

app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/cars', carRoutes)

app.get('/', (req, res) => {
    res.send('Achie Sells Cars API is running!')
})

const PORT = process.env.PORT || 5000

const startServer = async () => {
    await connectDB()
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

startServer()