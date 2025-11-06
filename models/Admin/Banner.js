const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '', trim: true },
    buttonText: { type: String, default: '', trim: true },
    buttonLink: { type: String, default: '#', trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Banner', bannerSchema)

