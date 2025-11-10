const jwt = require('jsonwebtoken')
const User = require('../models/User/User')

async function protect(req, res, next) {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret')
      const user = await User.findById(decoded.id).select('-password')
      if (!user) return res.status(401).json({ message: 'Not authorized' })
      req.user = user
      return next()
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token failed' })
    }
  }
  return res.status(401).json({ message: 'Not authorized, no token' })
}

module.exports = { protect }