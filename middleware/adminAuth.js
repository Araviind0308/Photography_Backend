const jwt = require('jsonwebtoken')

async function adminProtect(req, res, next) {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret')
      if (!decoded || decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' })
      }
      req.admin = { id: decoded.id, role: decoded.role }
      return next()
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token failed' })
    }
  }
  return res.status(401).json({ message: 'Not authorized, no token' })
}

module.exports = { adminProtect }


