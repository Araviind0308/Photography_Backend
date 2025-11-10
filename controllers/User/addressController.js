const Address = require('../../models/User/Address')

// GET /api/addresses - Get all addresses for logged-in user
async function getAddresses(req, res, next) {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 })
    res.json({ addresses })
  } catch (err) {
    next(err)
  }
}

// GET /api/addresses/:id - Get single address
async function getAddress(req, res, next) {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id })
    if (!address) {
      return res.status(404).json({ message: 'Address not found' })
    }
    res.json({ address })
  } catch (err) {
    next(err)
  }
}

// POST /api/addresses - Create new address
async function createAddress(req, res, next) {
  try {
    const { name, address, city, state, zipCode, country, phone, isDefault } = req.body

    if (!name || !address || !city || !state || !zipCode || !country) {
      return res.status(400).json({ message: 'All required fields must be provided' })
    }

    const newAddress = await Address.create({
      user: req.user._id,
      name,
      address,
      city,
      state,
      zipCode,
      country: country || 'India',
      phone,
      isDefault: isDefault || false,
    })

    res.status(201).json({ address: newAddress })
  } catch (err) {
    next(err)
  }
}

// PUT /api/addresses/:id - Update address
async function updateAddress(req, res, next) {
  try {
    const { name, address, city, state, zipCode, country, phone, isDefault } = req.body

    const addressDoc = await Address.findOne({ _id: req.params.id, user: req.user._id })
    if (!addressDoc) {
      return res.status(404).json({ message: 'Address not found' })
    }

    if (name) addressDoc.name = name
    if (address) addressDoc.address = address
    if (city) addressDoc.city = city
    if (state) addressDoc.state = state
    if (zipCode) addressDoc.zipCode = zipCode
    if (country) addressDoc.country = country
    if (phone !== undefined) addressDoc.phone = phone
    if (isDefault !== undefined) addressDoc.isDefault = isDefault

    await addressDoc.save()
    res.json({ address: addressDoc })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/addresses/:id - Delete address
async function deleteAddress(req, res, next) {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id })
    if (!address) {
      return res.status(404).json({ message: 'Address not found' })
    }

    await address.deleteOne()
    res.json({ message: 'Address deleted successfully' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
}

