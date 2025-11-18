const Order = require('../../models/User/Order')
const User = require('../../models/User/User')
const Product = require('../../models/Admin/Product')
const Coupon = require('../../models/Admin/Coupon')

// GET /api/admin/analytics/dashboard - Get dashboard analytics (admin)
async function getDashboardStats(req, res, next) {
  try {
    const { startDate, endDate } = req.query
    
    const dateFilter = {}
    if (startDate || endDate) {
      dateFilter.createdAt = {}
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate)
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate)
    }

    // Orders
    const orders = await Order.find(dateFilter)
    const totalOrders = orders.length
    const totalRevenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0)
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Customers
    const totalCustomers = await User.countDocuments({ role: 'user' })
    const activeCustomers = new Set(orders.map(o => o.user.toString())).size

    // Products
    const totalProducts = await Product.countDocuments()
    const publishedProducts = await Product.countDocuments({ isPublished: true })

    // Order status breakdown
    const orderStatusBreakdown = {
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    }

    // Revenue by month (last 6 months)
    const revenueByMonth = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      
      const monthOrders = await Order.find({
        createdAt: { $gte: monthStart, $lte: monthEnd },
        status: { $ne: 'cancelled' }
      })
      
      const monthRevenue = monthOrders.reduce((sum, o) => sum + (o.total || 0), 0)
      
      revenueByMonth.push({
        month: monthStart.toLocaleString('default', { month: 'short' }),
        revenue: monthRevenue,
        orders: monthOrders.length
      })
    }

    // Top products (by order count)
    const productOrderCount = {}
    orders.forEach(order => {
      order.items.forEach(item => {
        const productId = item.product?.toString() || item.product
        if (productId) {
          productOrderCount[productId] = (productOrderCount[productId] || 0) + item.quantity
        }
      })
    })

    const topProducts = await Product.find({
      _id: { $in: Object.keys(productOrderCount) }
    }).limit(5)

    const topProductsData = topProducts.map(product => ({
      id: product._id,
      title: product.title,
      orders: productOrderCount[product._id.toString()] || 0,
      image: product.coverImage || product.image
    })).sort((a, b) => b.orders - a.orders)

    // Coupons
    const totalCoupons = await Coupon.countDocuments()
    const activeCoupons = await Coupon.countDocuments({ isActive: true })

    const stats = {
      revenue: {
        total: totalRevenue,
        averageOrder: averageOrderValue,
        trend: revenueByMonth
      },
      orders: {
        total: totalOrders,
        breakdown: orderStatusBreakdown
      },
      customers: {
        total: totalCustomers,
        active: activeCustomers
      },
      products: {
        total: totalProducts,
        published: publishedProducts
      },
      coupons: {
        total: totalCoupons,
        active: activeCoupons
      },
      topProducts: topProductsData
    }

    res.json({ stats })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getDashboardStats,
}

