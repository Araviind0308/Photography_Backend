const jwt = require('jsonwebtoken')
const Admin = require('../../models/Admin/Admin')

const DEFAULT_ADMIN_EMAIL = 'demo@gmail.com'
const DEFAULT_ADMIN_PASSWORD = 'demo123'

function signAdminToken(adminId) {
  return jwt.sign({ id: adminId, role: 'admin' }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

async function ensureDefaultAdmin() {
  const existing = await Admin.findOne({ email: DEFAULT_ADMIN_EMAIL })
  if (existing) return existing
  const created = await Admin.create({ email: DEFAULT_ADMIN_EMAIL, password: DEFAULT_ADMIN_PASSWORD, name: 'Admin' })
  return created
}

// Public: POST /api/admin/login
async function loginAdmin(req, res, next) {
  try {
    const { email, password } = req.body
    const admin = await Admin.findOne({ email })
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' })
    const isMatch = await admin.comparePassword(password)
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' })

    const token = signAdminToken(admin._id)
    res.json({
      admin: { id: admin._id, email: admin.email, name: admin.name, role: admin.role },
      token,
    })
  } catch (err) {
    next(err)
  }
}

// Private: GET /api/admin/me
async function getAdminMe(req, res, next) {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password')
    if (!admin) return res.status(404).json({ message: 'Admin not found' })
    res.json({ admin })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  ensureDefaultAdmin,
  loginAdmin,
  getAdminMe,
}


