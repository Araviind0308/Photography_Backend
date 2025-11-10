const express = require('express')
const {
  getAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
} = require('../../controllers/User/addressController')
const { protect } = require('../../middleware/auth')

const router = express.Router()

// All routes require authentication
router.use(protect)

router.get('/', getAddresses)
router.get('/:id', getAddress)
router.post('/', createAddress)
router.put('/:id', updateAddress)
router.delete('/:id', deleteAddress)

module.exports = router

