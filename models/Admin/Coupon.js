const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: '' },
    discount: { type: Number, required: true, min: 0 },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
    },
    minAmount: { type: Number, default: 0 }, // Minimum order amount
    maxDiscount: { type: Number }, // Maximum discount amount (for percentage)
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date },
    usageLimit: { type: Number }, // Total usage limit
    usedCount: { type: Number, default: 0 },
    userLimit: { type: Number, default: 1 }, // Per user usage limit
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Check if coupon is valid
couponSchema.methods.isValid = function (userId, orderAmount) {
  const now = new Date()
  
  // Check if active
  if (!this.isActive) return { valid: false, message: 'Coupon is not active' }
  
  // Check date validity
  if (this.validFrom && now < this.validFrom) {
    return { valid: false, message: 'Coupon is not yet valid' }
  }
  
  if (this.validUntil && now > this.validUntil) {
    return { valid: false, message: 'Coupon has expired' }
  }
  
  // Check minimum amount
  if (orderAmount < this.minAmount) {
    return { valid: false, message: `Minimum order amount of ₹${this.minAmount} required` }
  }
  
  // Check usage limit
  if (this.usageLimit && this.usedCount >= this.usageLimit) {
    return { valid: false, message: 'Coupon usage limit reached' }
  }
  
  return { valid: true }
}

const Coupon = mongoose.model('Coupon', couponSchema)
module.exports = Coupon

