const ProductESM = require('../../models/Admin/Product')
const Product = ProductESM && ProductESM.default ? ProductESM.default : ProductESM

function toWebPath(filePath) {
  if (!filePath) return ''
  const idx = filePath.replace(/\\/g, '/').indexOf('/uploads/')
  if (idx >= 0) return filePath.replace(/\\/g, '/').slice(idx)
  return filePath.replace(/\\/g, '/')
}

function parseMaybeJSON(value) {
  if (value == null) return undefined
  if (Array.isArray(value) || typeof value === 'object') return value
  try { return JSON.parse(value) } catch (_) { return value }
}

async function createProduct(req, res, next) {
  try {
    const body = req.body
    const payload = {
      subCategory: body.subCategory,
      title: body.title,
      description: body.description,
      price: body.price,
      currency: body.currency,
      isPublished: body.isPublished,
      printSizes: parseMaybeJSON(body.printSizes) || [],
      printMaterials: parseMaybeJSON(body.printMaterials) || [],
      framingOptions: parseMaybeJSON(body.framingOptions) || [],
      // Filter fields
      theme: body.theme,
      color: body.color,
      country: body.country,
      bestseller: body.bestseller === 'true' || body.bestseller === true,
      // Product details
      originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : undefined,
      inStock: body.inStock !== undefined ? (body.inStock === 'true' || body.inStock === true) : true,
      rating: body.rating ? parseFloat(body.rating) : 0,
      reviews: body.reviews ? parseInt(body.reviews) : 0,
      discount: body.discount ? parseFloat(body.discount) : 0,
    }

    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      payload.coverImage = toWebPath(req.files.coverImage[0].path)
    }
    if (req.files && req.files.galleryImages) {
      payload.galleryImages = req.files.galleryImages.map(f => toWebPath(f.path))
    }

    const product = await Product.create(payload)
    res.status(201).json({ product })
  } catch (err) {
    next(err)
  }
}

async function listProducts(req, res, next) {
  try {
    const { subCategory } = req.query
    const filter = {}
    if (subCategory) filter.subCategory = subCategory
    const products = await Product.find(filter).populate({ path: 'subCategory', populate: { path: 'category' } }).sort({ createdAt: -1 })
    res.json({ products })
  } catch (err) {
    next(err)
  }
}

async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).populate({ path: 'subCategory', populate: { path: 'category' } })
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json({ product })
  } catch (err) {
    next(err)
  }
}

async function updateProduct(req, res, next) {
  try {
    const body = req.body
    const updates = {
      subCategory: body.subCategory,
      title: body.title,
      description: body.description,
      price: body.price,
      currency: body.currency,
      isPublished: body.isPublished,
      // Filter fields
      theme: body.theme,
      color: body.color,
      country: body.country,
      bestseller: body.bestseller !== undefined ? (body.bestseller === 'true' || body.bestseller === true) : undefined,
      // Product details
      originalPrice: body.originalPrice !== undefined ? parseFloat(body.originalPrice) : undefined,
      inStock: body.inStock !== undefined ? (body.inStock === 'true' || body.inStock === true) : undefined,
      rating: body.rating !== undefined ? parseFloat(body.rating) : undefined,
      reviews: body.reviews !== undefined ? parseInt(body.reviews) : undefined,
      discount: body.discount !== undefined ? parseFloat(body.discount) : undefined,
    }
    
    // Remove undefined fields
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key])
    const sizes = parseMaybeJSON(body.printSizes)
    const materials = parseMaybeJSON(body.printMaterials)
    const frames = parseMaybeJSON(body.framingOptions)
    if (sizes !== undefined) updates.printSizes = sizes
    if (materials !== undefined) updates.printMaterials = materials
    if (frames !== undefined) updates.framingOptions = frames

    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      updates.coverImage = toWebPath(req.files.coverImage[0].path)
    }
    if (req.files && req.files.galleryImages && req.files.galleryImages.length > 0) {
      const newGallery = req.files.galleryImages.map(f => toWebPath(f.path))
      updates.$push = { galleryImages: { $each: newGallery } }
    }

    const removeGallery = parseMaybeJSON(body.removeGallery)
    let product
    if (removeGallery && Array.isArray(removeGallery) && removeGallery.length > 0) {
      product = await Product.findByIdAndUpdate(
        req.params.id,
        { ...updates, $pull: { galleryImages: { $in: removeGallery } } },
        { new: true, runValidators: true }
      )
    } else {
      product = await Product.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true, runValidators: true }
      )
    }

    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json({ product })
  } catch (err) {
    next(err)
  }
}

async function deleteProduct(req, res, next) {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: 'Product not found' })
    res.json({ message: 'Product deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createProduct,
  listProducts,
  getProduct,
  updateProduct,
  deleteProduct,
}


