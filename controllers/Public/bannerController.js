const Banner = require('../../models/Admin/Banner')

// GET /api/banners - Get all active banners (public)
async function getBanners(req, res, next) {
  try {
    const banners = await Banner.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .select('image title subtitle buttonText buttonLink order')
    
    res.json({ banners })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getBanners,
}

