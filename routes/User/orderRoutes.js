const express = require('express')
const { getOrders, getOrder, createOrder, updateOrderStatus } = require('../../controllers/User/orderController')
const { protect } = require('../../middleware/auth')

const router = express.Router()

// All routes require authentication
router.use(protect)

router.get('/', getOrders)
router.get('/:id', getOrder)
router.post('/', createOrder)
router.put('/:id/status', updateOrderStatus) // Admin only - add admin check if needed

module.exports = router

