import express from 'express'
import {
    registerUser,
    loginUser,
    getMe,
    verifyEmail,
    resendVerificationCode
} from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/verify', verifyEmail)
router.post('/resend-code', resendVerificationCode)
router.get('/me', protect, getMe)

export default router