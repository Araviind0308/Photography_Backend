const express = require('express')
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
} = require('../../controllers/User/cartController')
const { protect } = require('../../middleware/auth')

const router = express.Router()

// All routes require authentication
router.use(protect)

router.get('/', getCart)
router.post('/items', addToCart)
router.put('/items/:itemId', updateCartItem)
router.delete('/items/:itemId', removeFromCart)
router.delete('/', clearCart)
router.post('/coupon', applyCoupon)
router.delete('/coupon', removeCoupon)

module.exports = router

