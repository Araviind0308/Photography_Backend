const mongoose = require('mongoose')

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, default: '', trim: true },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    comment: { type: String, required: true, trim: true },
    image: { type: String, default: '' }, // Customer profile image
    backgroundImage: { type: String, default: '' }, // Background photo for testimonial
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Testimonial', testimonialSchema)

