const Product = require('../../models/Admin/Product')

// GET /api/products - Get all products with filters
async function getProducts(req, res, next) {
  try {
    const { theme, color, country, bestseller, search, page = 1, limit = 60 } = req.query

    // Build filter object
    const filter = { isPublished: true }

    if (theme) filter.theme = theme
    if (color) {
      if (color === 'yellow-orange-red') {
        filter.color = { $in: ['yellow', 'orange', 'red'] }
      } else {
        filter.color = color
      }
    }
    if (country) filter.country = country
    if (bestseller === 'true') filter.bestseller = true

    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit)

    // Get products
    const products = await Product.find(filter)
      .select('-printSizes -printMaterials -framingOptions') // Exclude detailed options for list view
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    // Get total count
    const total = await Product.countDocuments(filter)

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/products/:id - Get single product
async function getProduct(req, res, next) {
  try {
    const product = await Product.findOne({ _id: req.params.id, isPublished: true })

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json({ product })
  } catch (err) {
    next(err)
  }
}

// GET /api/products/filters/themes - Get all themes
async function getThemes(req, res, next) {
  try {
    const themes = await Product.distinct('theme', { isPublished: true, theme: { $ne: null } })
    res.json({ themes })
  } catch (err) {
    next(err)
  }
}

// GET /api/products/filters/colors - Get all colors
async function getColors(req, res, next) {
  try {
    const colors = await Product.distinct('color', { isPublished: true, color: { $ne: null } })
    res.json({ colors })
  } catch (err) {
    next(err)
  }
}

// GET /api/products/filters/countries - Get all countries
async function getCountries(req, res, next) {
  try {
    const countries = await Product.distinct('country', { isPublished: true, country: { $ne: null } })
    res.json({ countries })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getProducts,
  getProduct,
  getThemes,
  getColors,
  getCountries,
}

