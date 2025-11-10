const Testimonial = require('../../models/Admin/Testimonial')

function toWebPath(filePath) {
  if (!filePath) return ''
  const idx = filePath.replace(/\\/g, '/').indexOf('/uploads/')
  if (idx >= 0) return filePath.replace(/\\/g, '/').slice(idx)
  return filePath.replace(/\\/g, '/')
}

async function createTestimonial(req, res, next) {
  try {
    const { name, location, rating, comment, order, isActive } = req.body

    if (!name) {
      return res.status(400).json({ message: 'name is required' })
    }

    if (!comment) {
      return res.status(400).json({ message: 'comment is required' })
    }

    const payload = {
      name: name.trim(),
      location: location ? location.trim() : '',
      rating: rating ? parseInt(rating) : 5,
      comment: comment.trim(),
      order: order ? parseInt(order) : 0,
      isActive: isActive !== undefined ? isActive === 'true' || isActive === true : true,
    }

    if (req.files && req.files.image && req.files.image[0]) {
      payload.image = toWebPath(req.files.image[0].path)
    }

    if (req.files && req.files.backgroundImage && req.files.backgroundImage[0]) {
      payload.backgroundImage = toWebPath(req.files.backgroundImage[0].path)
    }

    const testimonial = await Testimonial.create(payload)
    res.status(201).json({ testimonial })
  } catch (err) {
    next(err)
  }
}

async function listTestimonials(req, res, next) {
  try {
    const { isActive } = req.query
    const filter = {}
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true'
    }
    const testimonials = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 })
    res.json({ testimonials })
  } catch (err) {
    next(err)
  }
}

async function getTestimonial(req, res, next) {
  try {
    const { id } = req.params
    const testimonial = await Testimonial.findById(id)
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' })
    }
    res.json({ testimonial })
  } catch (err) {
    next(err)
  }
}

async function updateTestimonial(req, res, next) {
  try {
    const { id } = req.params
    const { name, location, rating, comment, order, isActive } = req.body

    const updates = {}
    if (name !== undefined) updates.name = name.trim()
    if (location !== undefined) updates.location = location.trim()
    if (rating !== undefined) updates.rating = parseInt(rating)
    if (comment !== undefined) updates.comment = comment.trim()
    if (order !== undefined) updates.order = parseInt(order)
    if (isActive !== undefined) {
      updates.isActive = isActive === 'true' || isActive === true
    }

    if (req.files && req.files.image && req.files.image[0]) {
      updates.image = toWebPath(req.files.image[0].path)
    }

    if (req.files && req.files.backgroundImage && req.files.backgroundImage[0]) {
      updates.backgroundImage = toWebPath(req.files.backgroundImage[0].path)
    }

    const testimonial = await Testimonial.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' })
    }

    res.json({ testimonial })
  } catch (err) {
    next(err)
  }
}

async function deleteTestimonial(req, res, next) {
  try {
    const { id } = req.params
    const deleted = await Testimonial.findByIdAndDelete(id)
    if (!deleted) {
      return res.status(404).json({ message: 'Testimonial not found' })
    }
    res.json({ message: 'Testimonial deleted successfully' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createTestimonial,
  listTestimonials,
  getTestimonial,
  updateTestimonial,
  deleteTestimonial,
}

