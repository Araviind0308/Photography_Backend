const express = require('express')
const { getTestimonials } = require('../../controllers/Public/testimonialController')

const router = express.Router()

// Public routes - no authentication required
router.get('/', getTestimonials)

module.exports = router

