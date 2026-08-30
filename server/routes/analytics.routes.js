import express from 'express'
import { getAnalytics } from '../controllers/analytics.controller.js'
import { protect, adminOnly } from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/', protect, adminOnly, getAnalytics)

export default router