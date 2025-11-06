const jwt = require('jsonwebtoken')
const User = require('../../models/User/User')
const VerificationCode = require('../../models/User/VerificationCode')

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

// Generate 6-digit random code
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Public: POST /api/users/register
// Accepts email, generates and sends 6-digit code
// If email exists, still sends code (for login flow)
async function registerUser(req, res, next) {
  try {
    const { email } = req.body
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    
    // Generate 6-digit code
    const code = generateCode()
    
    // Set expiry to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
    
    // Delete any existing codes for this email
    await VerificationCode.deleteMany({ email: email.toLowerCase() })
    
    // Save new verification code
    await VerificationCode.create({
      email: email.toLowerCase(),
      code,
      expiresAt,
    })

    // TODO: Send email with code here
    // For now, return code in response (remove in production)
    // In production, send email and don't return code
    console.log(`Verification code for ${email}: ${code}`)

    res.status(200).json({
      message: 'Verification code sent to email',
      // Remove code in production - only for testing
      code: code || "123456" ,
      email: email.toLowerCase(),
    })
  } catch (err) {
    next(err)
  }
}

// Public: POST /api/users/login
// Accepts email and 6-digit code, verifies and returns token
async function loginUser(req, res, next) {
  try {
    const { email, code } = req.body
    
    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' })
    }

    // Validate code format
    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({ message: 'Code must be 6 digits' })
    }

    // Find verification code
    const verificationCode = await VerificationCode.findOne({
      email: email.toLowerCase(),
      code,
    })

    if (!verificationCode) {
      return res.status(401).json({ message: 'Invalid or expired code' })
    }

    // Check if code is expired
    if (verificationCode.expiresAt < new Date()) {
      await VerificationCode.deleteOne({ _id: verificationCode._id })
      return res.status(401).json({ message: 'Code has expired' })
    }

    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase() })
    
    if (!user) {
      // Create new user if doesn't exist
      // Generate name from email
      const name = email.split('@')[0]
      user = await User.create({
        email: email.toLowerCase(),
        name,
        role: 'user',
      })
    }

    // Delete used verification code
    await VerificationCode.deleteOne({ _id: verificationCode._id })

    // Generate token
    const token = signToken(user._id)

    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    })
  } catch (err) {
    next(err)
  }
}

// Private: GET /api/users/me
async function getMe(req, res, next) {
  try {
    res.json({ user: req.user })
  } catch (err) {
    next(err)
  }
}

// Private: PUT /api/users/me
async function updateMe(req, res, next) {
  try {
    const updates = {}
    if (req.body.name) updates.name = req.body.name
    if (req.body.email) updates.email = req.body.email
    if (req.body.password) updates.password = req.body.password

    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    Object.assign(user, updates)
    await user.save()

    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    next(err)
  }
}

// Admin: GET /api/users
async function getUsers(req, res, next) {
  try {
    const users = await User.find().select('-password')
    res.json({ users })
  } catch (err) {
    next(err)
  }
}

// Admin: GET /api/users/:id
async function getUserById(req, res, next) {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user })
  } catch (err) {
    next(err)
  }
}

// Admin: PUT /api/users/:id
async function updateUser(req, res, next) {
  try {
    const { name, email, role, password } = req.body
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (name) user.name = name
    if (email) user.email = email
    if (typeof role === 'string') user.role = role
    if (password) user.password = password

    await user.save()
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    next(err)
  }
}

// Admin: DELETE /api/users/:id
async function deleteUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    await user.deleteOne()
    res.json({ message: 'User deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
}
