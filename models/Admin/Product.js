const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory',
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    currency: { type: String, default: 'INR' },
    image: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    images: [{ type: String }],
    galleryImages: [{ type: String }],

    // Filter fields
    theme: { type: String, trim: true, index: true }, // aerial-views, classic-landscapes, etc.
    color: { type: String, trim: true, index: true }, // blue, green, brown, etc.
    country: { type: String, trim: true, index: true }, // iceland, norway, etc.
    bestseller: { type: Boolean, default: false, index: true },

    // Product details
    inStock: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    discount: { type: Number, default: 0 }, // Percentage

    printSizes: [
      {
        id: { type: String },
        name: { type: String },
        width: { type: Number },
        height: { type: Number },
        price: { type: Number, default: 0 },
      },
    ],
    printMaterials: [
      {
        id: { type: String },
        name: { type: String },
        price: { type: Number, default: 0 },
        description: { type: String },
        image: { type: String },
      },
    ],
    framingOptions: [
      {
        id: { type: String },
        name: { type: String },
        price: { type: Number, default: 0 },
        description: { type: String },
        image: { type: String },
        frameType: { type: String }, // none, black, white
      },
    ],

    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Indexes for faster filtering
productSchema.index({ theme: 1, color: 1, country: 1 })
productSchema.index({ bestseller: 1, isPublished: 1 })

module.exports = mongoose.model('Product', productSchema)
