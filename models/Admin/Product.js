const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory',
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    coverImage: { type: String, default: '' },
    galleryImages: [{ type: String }],

    printSizes: [
      {
        label: { type: String },
        value: { type: String },
      },
    ],
    printMaterials: [
      {
        label: { type: String },
        value: { type: String },
      },
    ],
    framingOptions: [
      {
        label: { type: String },
        value: { type: String },
      },
    ],

    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Product', productSchema)
