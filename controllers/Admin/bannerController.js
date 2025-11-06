const Banner = require('../../models/Admin/Banner')

function toWebPath(filePath) {
  if (!filePath) return ''
  const idx = filePath.replace(/\\/g, '/').indexOf('/uploads/')
  if (idx >= 0) return filePath.replace(/\\/g, '/').slice(idx)
  return filePath.replace(/\\/g, '/')
}

async function createBanner(req, res, next) {
  try {
    const { title, subtitle, buttonText, buttonLink, order, isActive } = req.body

    if (!title) {
      return res.status(400).json({ message: 'title is required' })
    }

    if (!req.file) {
      return res.status(400).json({ message: 'image is required' })
    }

    const payload = {
      image: toWebPath(req.file.path),
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : '',
      buttonText: buttonText ? buttonText.trim() : '',
      buttonLink: buttonLink ? buttonLink.trim() : '#',
      order: order ? parseInt(order) : 0,
      isActive: isActive !== undefined ? isActive === 'true' || isActive === true : true,
    }

    const banner = await Banner.create(payload)
    res.status(201).json({ banner })
  } catch (err) {
    next(err)
  }
}

async function listBanners(req, res, next) {
  try {
    const { isActive } = req.query
    const filter = {}
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true'
    }
    const banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 })
    res.json({ banners })
  } catch (err) {
    next(err)
  }
}

async function getBanner(req, res, next) {
  try {
    const { id } = req.params
    const banner = await Banner.findById(id)
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' })
    }
    res.json({ banner })
  } catch (err) {
    next(err)
  }
}

async function updateBanner(req, res, next) {
  try {
    const { id } = req.params
    const { title, subtitle, buttonText, buttonLink, order, isActive } = req.body

    const updates = {}
    if (title !== undefined) updates.title = title.trim()
    if (subtitle !== undefined) updates.subtitle = subtitle.trim()
    if (buttonText !== undefined) updates.buttonText = buttonText.trim()
    if (buttonLink !== undefined) updates.buttonLink = buttonLink.trim()
    if (order !== undefined) updates.order = parseInt(order)
    if (isActive !== undefined) {
      updates.isActive = isActive === 'true' || isActive === true
    }

    if (req.file) {
      updates.image = toWebPath(req.file.path)
    }

    const banner = await Banner.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' })
    }

    res.json({ banner })
  } catch (err) {
    next(err)
  }
}

async function deleteBanner(req, res, next) {
  try {
    const { id } = req.params
    const deleted = await Banner.findByIdAndDelete(id)
    if (!deleted) {
      return res.status(404).json({ message: 'Banner not found' })
    }
    res.json({ message: 'Banner deleted successfully' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createBanner,
  listBanners,
  getBanner,
  updateBanner,
  deleteBanner,
}

