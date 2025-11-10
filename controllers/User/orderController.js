const Order = require('../../models/User/Order')
const Cart = require('../../models/User/Cart')
const Address = require('../../models/User/Address')
const Coupon = require('../../models/Admin/Coupon')

// GET /api/orders - Get all orders for logged-in user
async function getOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'title image')

    res.json({ orders })
  } catch (err) {
    next(err)
  }
}

// GET /api/orders/:id - Get single order
async function getOrder(req, res, next) {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate(
      'items.product',
      'title image price'
    )

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.json({ order })
  } catch (err) {
    next(err)
  }
}

// POST /api/orders - Create new order from cart
async function createOrder(req, res, next) {
  try {
    const { shippingAddressId, paymentMethod } = req.body

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product')
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' })
    }

    // Get shipping address
    let shippingAddress
    if (shippingAddressId) {
      const address = await Address.findOne({ _id: shippingAddressId, user: req.user._id })
      if (!address) {
        return res.status(404).json({ message: 'Shipping address not found' })
      }
      shippingAddress = {
        name: address.name,
        address: address.address,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        phone: address.phone,
      }
    } else {
      // Use address from request body
      const { name, address, city, state, zipCode, country, phone } = req.body
      if (!name || !address || !city || !state || !zipCode || !country) {
        return res.status(400).json({ message: 'Shipping address is required' })
      }
      shippingAddress = { name, address, city, state, zipCode, country, phone }
    }

    // Calculate totals
    const totals = cart.calculateTotals()

    // Create order items
    const orderItems = cart.items.map((item) => ({
      product: item.product._id || item.product,
      name: item.name,
      price: item.price,
      image: item.image,
      selectedImageIndex: item.selectedImageIndex,
      size: item.size,
      material: item.material,
      framing: item.framing,
      quantity: item.quantity,
    }))

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      subtotal: totals.subtotal,
      discount: totals.discount,
      total: totals.total,
      coupon: cart.coupon.code
        ? {
            code: cart.coupon.code,
            discount: totals.discount,
          }
        : undefined,
      paymentMethod: paymentMethod || 'cod',
      status: 'pending',
      paymentStatus: paymentMethod === 'online' ? 'pending' : 'pending',
    })

    // Update coupon usage if applied
    if (cart.coupon.code) {
      const coupon = await Coupon.findOne({ code: cart.coupon.code })
      if (coupon) {
        coupon.usedCount += 1
        await coupon.save()
      }
    }

    // Clear cart after order creation
    cart.items = []
    cart.coupon = {}
    await cart.save()

    res.status(201).json({
      message: 'Order created successfully',
      order: await Order.findById(order._id).populate('items.product', 'title image'),
    })
  } catch (err) {
    next(err)
  }
}

// PUT /api/orders/:id/status - Update order status (admin only)
async function updateOrderStatus(req, res, next) {
  try {
    const { status, paymentStatus } = req.body

    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (status) order.status = status
    if (paymentStatus) order.paymentStatus = paymentStatus

    await order.save()

    res.json({
      message: 'Order status updated successfully',
      order: await Order.findById(order._id).populate('items.product', 'title image'),
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
}

