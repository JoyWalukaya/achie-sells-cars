import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

export const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill in all fields' })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' })
        }

        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({ message: 'An account with this email already exists' })
        }

        const user = await User.create({
            name,
            email,
            password
        })

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill in all fields' })
        }

        const user = await User.findOne({ email })

        if (!user || !user.password) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        const isMatch = await user.matchPassword(password)

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password')
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}