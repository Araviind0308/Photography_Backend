const Cart = require('../../models/User/Cart')
const Product = require('../../models/Admin/Product')

// GET /api/cart - Get user's cart
async function getCart(req, res, next) {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'title image price inStock')

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] })
    }

    const totals = cart.calculateTotals()
    res.json({
      cart: {
        ...cart.toObject(),
        ...totals,
        itemCount: cart.items.reduce((total, item) => total + item.quantity, 0),
      },
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/cart/items - Add item to cart
async function addToCart(req, res, next) {
  try {
    const { productId, name, price, image, selectedImageIndex, size, material, framing, quantity } = req.body

    if (!productId || !name || !price || !image || !quantity) {
      return res.status(400).json({ message: 'Required fields: productId, name, price, image, quantity' })
    }

    // Verify product exists
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    if (!product.inStock) {
      return res.status(400).json({ message: 'Product is out of stock' })
    }

    let cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] })
    }

    // Check if item already exists with same options
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size === (size || '60x45') &&
        item.material === (material || 'aluminum-dibond') &&
        item.framing === (framing || 'unframed')
    )

    if (existingItemIndex !== -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity || 1
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        name,
        price,
        image,
        selectedImageIndex: selectedImageIndex || 0,
        size: size || '60x45',
        material: material || 'aluminum-dibond',
        framing: framing || 'unframed',
        quantity: quantity || 1,
      })
    }

    await cart.save()
    const totals = cart.calculateTotals()

    res.json({
      cart: {
        ...cart.toObject(),
        ...totals,
        itemCount: cart.items.reduce((total, item) => total + item.quantity, 0),
      },
    })
  } catch (err) {
    next(err)
  }
}

// PUT /api/cart/items/:itemId - Update cart item
async function updateCartItem(req, res, next) {
  try {
    const { quantity } = req.body

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' })
    }

    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    const itemIndex = cart.items.findIndex((item) => item._id.toString() === req.params.itemId)
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Cart item not found' })
    }

    cart.items[itemIndex].quantity = quantity
    await cart.save()

    const totals = cart.calculateTotals()
    res.json({
      cart: {
        ...cart.toObject(),
        ...totals,
        itemCount: cart.items.reduce((total, item) => total + item.quantity, 0),
      },
    })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/cart/items/:itemId - Remove item from cart
async function removeFromCart(req, res, next) {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId)
    await cart.save()

    const totals = cart.calculateTotals()
    res.json({
      cart: {
        ...cart.toObject(),
        ...totals,
        itemCount: cart.items.reduce((total, item) => total + item.quantity, 0),
      },
    })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/cart - Clear entire cart
async function clearCart(req, res, next) {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    cart.items = []
    cart.coupon = {}
    await cart.save()

    res.json({ message: 'Cart cleared successfully', cart })
  } catch (err) {
    next(err)
  }
}

// POST /api/cart/coupon - Apply coupon
async function applyCoupon(req, res, next) {
  try {
    const { code } = req.body

    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' })
    }

    const Coupon = require('../../models/Admin/Coupon')
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true })

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' })
    }

    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' })
    }

    const totals = cart.calculateTotals()
    const validation = coupon.isValid(req.user._id, totals.subtotal)

    if (!validation.valid) {
      return res.status(400).json({ message: validation.message })
    }

    cart.coupon = {
      code: coupon.code,
      discount: coupon.discount,
      discountType: coupon.discountType,
    }

    await cart.save()

    const newTotals = cart.calculateTotals()
    res.json({
      message: 'Coupon applied successfully',
      cart: {
        ...cart.toObject(),
        ...newTotals,
        itemCount: cart.items.reduce((total, item) => total + item.quantity, 0),
      },
    })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/cart/coupon - Remove coupon
async function removeCoupon(req, res, next) {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    cart.coupon = {}
    await cart.save()

    const totals = cart.calculateTotals()
    res.json({
      message: 'Coupon removed successfully',
      cart: {
        ...cart.toObject(),
        ...totals,
        itemCount: cart.items.reduce((total, item) => total + item.quantity, 0),
      },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
}

