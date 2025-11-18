const Order = require('../../models/User/Order')
const User = require('../../models/User/User')

// GET /api/admin/orders - Get all orders (admin)
async function listOrders(req, res, next) {
  try {
    const { status, paymentStatus, page = 1, limit = 50 } = req.query
    const filter = {}
    
    if (status) filter.status = status
    if (paymentStatus) filter.paymentStatus = paymentStatus

    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('items.product', 'title coverImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Order.countDocuments(filter)

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/orders/:id - Get single order (admin)
async function getOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'title coverImage price')

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.json({ order })
  } catch (err) {
    next(err)
  }
}

// PUT /api/admin/orders/:id/status - Update order status (admin)
async function updateOrderStatus(req, res, next) {
  try {
    const { status, paymentStatus, trackingNumber } = req.body

    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (status) {
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' })
      }
      order.status = status
    }

    if (paymentStatus) {
      const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded']
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({ message: 'Invalid payment status' })
      }
      order.paymentStatus = paymentStatus
    }

    if (trackingNumber) {
      order.trackingNumber = trackingNumber
    }

    await order.save()

    const updatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.product', 'title coverImage')

    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/orders/stats - Get order statistics (admin)
async function getOrderStats(req, res, next) {
  try {
    const { startDate, endDate } = req.query
    
    const filter = {}
    if (startDate || endDate) {
      filter.createdAt = {}
      if (startDate) filter.createdAt.$gte = new Date(startDate)
      if (endDate) filter.createdAt.$lte = new Date(endDate)
    }

    const orders = await Order.find(filter)
    
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (o.total || 0), 0),
      averageOrderValue: orders.length > 0
        ? orders.reduce((sum, o) => sum + (o.total || 0), 0) / orders.length
        : 0
    }

    res.json({ stats })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  listOrders,
  getOrder,
  updateOrderStatus,
  getOrderStats,
}

