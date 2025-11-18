const User = require('../../models/User/User')
const Order = require('../../models/User/Order')

// GET /api/admin/customers - Get all customers (admin)
async function listCustomers(req, res, next) {
  try {
    const { page = 1, limit = 50, search } = req.query
    const filter = { role: 'user' }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    // Get order statistics for each user
    const customersWithStats = await Promise.all(
      users.map(async (user) => {
        const orders = await Order.find({ user: user._id })
        const totalSpent = orders
          .filter(o => o.status !== 'cancelled')
          .reduce((sum, o) => sum + (o.total || 0), 0)
        
        return {
          ...user.toObject(),
          ordersCount: orders.length,
          totalSpent,
          lastOrder: orders.length > 0 
            ? orders.sort((a, b) => b.createdAt - a.createdAt)[0].createdAt 
            : null
        }
      })
    )

    const total = await User.countDocuments(filter)

    res.json({
      customers: customersWithStats,
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

// GET /api/admin/customers/:id - Get single customer with details (admin)
async function getCustomer(req, res, next) {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user || user.role !== 'user') {
      return res.status(404).json({ message: 'Customer not found' })
    }

    // Get all orders for this customer
    const orders = await Order.find({ user: user._id })
      .populate('items.product', 'title coverImage price')
      .sort({ createdAt: -1 })

    const totalSpent = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0)

    const customer = {
      ...user.toObject(),
      orders,
      ordersCount: orders.length,
      totalSpent,
      averageOrderValue: orders.length > 0 ? totalSpent / orders.length : 0
    }

    res.json({ customer })
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/customers/stats - Get customer statistics (admin)
async function getCustomerStats(req, res, next) {
  try {
    const totalCustomers = await User.countDocuments({ role: 'user' })
    
    const orders = await Order.find().populate('user', 'name email')
    
    const customersWithOrders = new Set(orders.map(o => o.user._id.toString()))
    const activeCustomers = customersWithOrders.size
    
    const totalRevenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0)

    // Calculate VIP customers (spent more than 50000)
    const customerSpending = {}
    orders.forEach(order => {
      if (order.status !== 'cancelled') {
        const userId = order.user._id.toString()
        customerSpending[userId] = (customerSpending[userId] || 0) + (order.total || 0)
      }
    })
    
    const vipCustomers = Object.values(customerSpending).filter(spent => spent >= 50000).length

    const stats = {
      total: totalCustomers,
      active: activeCustomers,
      vip: vipCustomers,
      totalRevenue,
      averageCustomerValue: activeCustomers > 0 ? totalRevenue / activeCustomers : 0
    }

    res.json({ stats })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  listCustomers,
  getCustomer,
  getCustomerStats,
}

