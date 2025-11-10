const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  selectedImageIndex: { type: Number, default: 0 },
  size: { type: String, default: '60x45' },
  material: { type: String, default: 'aluminum-dibond' },
  framing: { type: String, default: 'unframed' },
  quantity: { type: Number, required: true, min: 1, default: 1 },
})

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    items: [cartItemSchema],
    coupon: {
      code: { type: String },
      discount: { type: Number, default: 0 },
      discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    },
  },
  { timestamps: true }
)

// Calculate totals
cartSchema.methods.calculateTotals = function () {
  const subtotal = this.items.reduce((total, item) => total + item.price * item.quantity, 0)
  
  let discount = 0
  if (this.coupon && this.coupon.code) {
    if (this.coupon.discountType === 'percentage') {
      discount = (subtotal * this.coupon.discount) / 100
    } else {
      discount = this.coupon.discount
    }
  }
  
  const total = Math.max(0, subtotal - discount)
  
  return { subtotal, discount, total }
}

const Cart = mongoose.model('Cart', cartSchema)
module.exports = Cart

