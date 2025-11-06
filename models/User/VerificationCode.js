const mongoose = require('mongoose')

const verificationCodeSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } }, // Auto-delete after expiry
  },
  { timestamps: true }
)

// Create index for faster lookups
verificationCodeSchema.index({ email: 1, code: 1 })

const VerificationCode = mongoose.model('VerificationCode', verificationCodeSchema)
module.exports = VerificationCode

