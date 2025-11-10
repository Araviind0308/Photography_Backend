const Coupon = require('../../models/Admin/Coupon')

// GET /api/coupons/:code - Validate coupon code
async function validateCoupon(req, res, next) {
  try {
    const { code } = req.params
    const { orderAmount } = req.query

    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' })
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true })

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' })
    }

    const orderAmountNum = parseFloat(orderAmount) || 0
    const validation = coupon.isValid(null, orderAmountNum)

    if (!validation.valid) {
      return res.status(400).json({ message: validation.message })
    }

    res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discount: coupon.discount,
        discountType: coupon.discountType,
        minAmount: coupon.minAmount,
        maxDiscount: coupon.maxDiscount,
        description: coupon.description,
      },
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/coupons - Get all active coupons (public)
async function getActiveCoupons(req, res, next) {
  try {
    const now = new Date()
    const coupons = await Coupon.find({
      isActive: true,
      validFrom: { $lte: now },
      $or: [{ validUntil: null }, { validUntil: { $gte: now } }],
    })
      .select('code description discount discountType minAmount maxDiscount validUntil')
      .sort({ createdAt: -1 })

    res.json({ coupons })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  validateCoupon,
  getActiveCoupons,
}

