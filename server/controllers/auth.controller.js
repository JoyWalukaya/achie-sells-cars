import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/sendEmail.js'

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill in all fields' })
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters and include an uppercase letter, lowercase letter, number and special character'
            })
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please enter a valid email address' })
        }

        const allowedDomains = [
            'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
            'icloud.com', 'live.com', 'me.com', 'protonmail.com',
            'aol.com', 'mail.com', 'ymail.com', 'msn.com'
        ]
        const emailDomain = email.split('@')[1].toLowerCase()
        if (!allowedDomains.includes(emailDomain)) {
            return res.status(400).json({ message: 'Please use a valid email provider like Gmail, Yahoo or Outlook' })
        }

        const userExists = await User.findOne({ email })
        if (userExists) {
            if (!userExists.isVerified) {
                const code = generateCode()
                await User.findByIdAndUpdate(userExists._id, {
                    verificationCode: code,
                    verificationCodeExpires: new Date(Date.now() + 15 * 60 * 1000)
                })
                await sendVerificationEmail(email, userExists.name, code)
                return res.status(200).json({
                    message: 'Account exists but is not verified. A new code has been sent.',
                    email
                })
            }
            return res.status(400).json({ message: 'An account with this email already exists' })
        }

        const code = generateCode()
        const codeExpires = new Date(Date.now() + 15 * 60 * 1000)

        const user = await User.create({
            name,
            email,
            password,
            isVerified: false
        })

        await User.findByIdAndUpdate(user._id, {
            verificationCode: code,
            verificationCodeExpires: codeExpires
        })

        await sendVerificationEmail(email, name, code)

        res.status(201).json({
            message: 'Registration successful. Please check your email for the verification code.',
            email
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }


        if (user.isVerified) {
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            })
        }

        if (user.verificationCode !== code.trim()) {
            return res.status(400).json({ message: 'Invalid verification code' })
        }

        if (user.verificationCodeExpires < new Date()) {
            return res.status(400).json({ message: 'Code has expired. Please request a new one.' })
        }

        await User.findByIdAndUpdate(user._id, {
            isVerified: true,
            verificationCode: null,
            verificationCodeExpires: null
        })

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

export const resendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Account already verified' })
        }

        const code = generateCode()
        await User.findByIdAndUpdate(user._id, {
            verificationCode: code,
            verificationCodeExpires: new Date(Date.now() + 15 * 60 * 1000)
        })

        await sendVerificationEmail(email, user.name, code)
        res.json({ message: 'Verification code resent. Please check your email.' })

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

        if (!user.isVerified) {
            const code = generateCode()
            await User.findByIdAndUpdate(user._id, {
                verificationCode: code,
                verificationCodeExpires: new Date(Date.now() + 15 * 60 * 1000)
            })
            await sendVerificationEmail(email, user.name, code)

            return res.status(403).json({
                message: 'Please verify your email before logging in. A new code has been sent.',
                needsVerification: true,
                email: user.email
            })
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
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ message: 'Please enter your email' })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: 'No account found with this email' })
        }

        const code = generateCode()

        await User.findByIdAndUpdate(user._id, {
            resetPasswordCode: code,
            resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000)
        })

        await sendPasswordResetEmail(email, user.name, code)

        res.json({ message: 'Password reset code sent to your email', email })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body

        if (!email || !code || !newPassword) {
            return res.status(400).json({ message: 'Please fill in all fields' })
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters and include uppercase, lowercase, number and special character'
            })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }

        if (user.resetPasswordCode !== code.trim()) {
            return res.status(400).json({ message: 'Invalid reset code' })
        }

        if (user.resetPasswordExpires < new Date()) {
            return res.status(400).json({ message: 'Reset code has expired. Please request a new one.' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        await User.findByIdAndUpdate(user._id, {
            password: hashedPassword,
            resetPasswordCode: null,
            resetPasswordExpires: null,
            isVerified: true
        })

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