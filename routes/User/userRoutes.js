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
const { protect } = require('../../middleware/auth')

const router = express.Router()

// public
router.post('/register', registerUser)
router.post('/login', loginUser)


// private
router.get('/me', protect, getMe)
router.put('/me', protect, updateMe)

// admin
router.get('/', protect,  getUsers)
router.get('/:id', protect, getUserById)
router.put('/:id', protect,  updateUser)
router.delete('/:id', protect,  deleteUser)

module.exports = router
