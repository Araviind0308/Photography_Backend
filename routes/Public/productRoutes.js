const express = require('express')
const {
  getProducts,
  getProduct,
  getThemes,
  getColors,
  getCountries,
} = require('../../controllers/Public/productController')

const router = express.Router()

// Public routes - no authentication required
router.get('/', getProducts)
router.get('/filters/themes', getThemes)
router.get('/filters/colors', getColors)
router.get('/filters/countries', getCountries)
router.get('/:id', getProduct)

module.exports = router

