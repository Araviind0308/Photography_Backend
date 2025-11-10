const express = require('express')
const { validateCoupon, getActiveCoupons } = require('../../controllers/Public/couponController')

const router = express.Router()

// Public routes - no authentication required
router.get('/', getActiveCoupons)
router.get('/:code', validateCoupon)

module.exports = router

