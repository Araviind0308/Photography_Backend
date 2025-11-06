const express = require('express')

//////////////////////// User Routes ////////////////////////

const {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../../controllers/User/userController')
const { protect, authorize } = require('../../middleware/auth')

const router = express.Router()

// public
router.post('/register', registerUser)
router.post('/login', loginUser)


// private
router.get('/me', protect, getMe)
router.put('/me', protect, updateMe)

// admin
router.get('/', protect, authorize('admin'), getUsers)
router.get('/:id', protect, authorize('admin'), getUserById)
router.put('/:id', protect, authorize('admin'), updateUser)
router.delete('/:id', protect, authorize('admin'), deleteUser)

module.exports = router
