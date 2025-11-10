const express = require('express')
const { getBanners } = require('../../controllers/Public/bannerController')

const router = express.Router()

// Public routes - no authentication required
router.get('/', getBanners)

module.exports = router

