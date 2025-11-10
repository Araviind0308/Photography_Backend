const Testimonial = require('../../models/Admin/Testimonial')

// GET /api/testimonials - Get all active testimonials (public)
async function getTestimonials(req, res, next) {
  try {
    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .select('name location rating comment image backgroundImage order')
    
    res.json({ testimonials })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getTestimonials,
}

