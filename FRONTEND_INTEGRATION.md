# Frontend Integration Guide

This guide explains how to integrate the Harshavardhan Photography backend API with your React frontend.

## 🔧 Setup

### 1. Create API Configuration File

Create `src/config/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export default API_BASE_URL
```

### 2. Create API Service File

Create `src/services/api.js`:

```javascript
import API_BASE_URL from '../config/api'

// Helper function to get auth token
const getToken = () => {
  return localStorage.getItem('harshavardhan_token')
}

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken()
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'API request failed')
    }

    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// API Methods
export const api = {
  // User APIs
  register: (email) => apiRequest('/users/register', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),

  login: (email, code) => apiRequest('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  }),

  getMe: () => apiRequest('/users/me'),

  updateMe: (data) => apiRequest('/users/me', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Product APIs
  getProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/products?${queryString}`)
  },

  getProduct: (id) => apiRequest(`/products/${id}`),

  getThemes: () => apiRequest('/products/filters/themes'),

  getColors: () => apiRequest('/products/filters/colors'),

  getCountries: () => apiRequest('/products/filters/countries'),

  // Cart APIs
  getCart: () => apiRequest('/cart'),

  addToCart: (item) => apiRequest('/cart/items', {
    method: 'POST',
    body: JSON.stringify(item),
  }),

  updateCartItem: (itemId, quantity) => apiRequest(`/cart/items/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  }),

  removeFromCart: (itemId) => apiRequest(`/cart/items/${itemId}`, {
    method: 'DELETE',
  }),

  clearCart: () => apiRequest('/cart', {
    method: 'DELETE',
  }),

  applyCoupon: (code) => apiRequest('/cart/coupon', {
    method: 'POST',
    body: JSON.stringify({ code }),
  }),

  removeCoupon: () => apiRequest('/cart/coupon', {
    method: 'DELETE',
  }),

  // Order APIs
  getOrders: () => apiRequest('/orders'),

  getOrder: (id) => apiRequest(`/orders/${id}`),

  createOrder: (orderData) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),

  // Address APIs
  getAddresses: () => apiRequest('/addresses'),

  getAddress: (id) => apiRequest(`/addresses/${id}`),

  createAddress: (address) => apiRequest('/addresses', {
    method: 'POST',
    body: JSON.stringify(address),
  }),

  updateAddress: (id, address) => apiRequest(`/addresses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(address),
  }),

  deleteAddress: (id) => apiRequest(`/addresses/${id}`, {
    method: 'DELETE',
  }),

  // Coupon APIs
  getActiveCoupons: () => apiRequest('/coupons'),

  validateCoupon: (code, orderAmount) => apiRequest(`/coupons/${code}?orderAmount=${orderAmount}`),
}
```

## 🔄 Update AuthContext

Update `src/context/AuthContext.jsx`:

```javascript
import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('harshavardhan_token')
    const savedUser = localStorage.getItem('harshavardhan_user')
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
        // Verify token by fetching user
        api.getMe()
          .then(({ user }) => {
            setUser(user)
            localStorage.setItem('harshavardhan_user', JSON.stringify(user))
          })
          .catch(() => {
            // Token invalid, clear storage
            logout()
          })
      } catch (err) {
        logout()
      }
    }
  }, [])

  const login = async (email, code) => {
    try {
      setError(null)
      const { user, token } = await api.login(email, code)
      
      localStorage.setItem('harshavardhan_token', token)
      localStorage.setItem('harshavardhan_user', JSON.stringify(user))
      setUser(user)
      
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, message: err.message }
    }
  }

  const register = async (email) => {
    try {
      setError(null)
      const { code } = await api.register(email)
      return { success: true, code }
    } catch (err) {
      setError(err.message)
      return { success: false, message: err.message }
    }
  }

  const logout = () => {
    // Clear all user-specific data
    const userId = user?.id
    if (userId) {
      localStorage.removeItem(`harshavardhan_orders_${userId}`)
      localStorage.removeItem(`harshavardhan_addresses_${userId}`)
    }
    
    localStorage.removeItem('harshavardhan_cart')
    localStorage.removeItem('harshavardhan_token')
    localStorage.removeItem('harshavardhan_user')
    
    setUser(null)
    setError(null)
  }

  const updateUser = async (data) => {
    try {
      const { user: updatedUser } = await api.updateMe(data)
      setUser(updatedUser)
      localStorage.setItem('harshavardhan_user', JSON.stringify(updatedUser))
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, message: err.message }
    }
  }

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('harshavardhan_token')
  }

  const value = {
    user,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated,
    setError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export default AuthContext
```

## 🛒 Update CartContext

Update `src/context/CartContext.jsx` to use API:

```javascript
import { createContext, useContext, useReducer, useEffect } from 'react'
import { api } from '../services/api'

// ... existing code ...

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const [loading, setLoading] = useState(true)

  // Load cart from API on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const { cart } = await api.getCart()
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cart })
      } catch (err) {
        console.error('Error loading cart:', err)
      } finally {
        setLoading(false)
      }
    }

    const token = localStorage.getItem('harshavardhan_token')
    if (token) {
      loadCart()
    } else {
      setLoading(false)
    }
  }, [])

  // Sync cart to API when state changes
  useEffect(() => {
    if (!loading && state.items.length > 0) {
      // Sync cart items to API
      // This can be optimized to batch updates
    }
  }, [state.items, loading])

  const addItem = async (item) => {
    try {
      const { cart } = await api.addToCart({
        productId: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        selectedImageIndex: item.selectedImageIndex || 0,
        size: item.size || '60x45',
        material: item.material || 'aluminum-dibond',
        framing: item.framing || 'unframed',
        quantity: item.quantity || 1,
      })
      
      dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cart })
      return { success: true }
    } catch (err) {
      console.error('Error adding to cart:', err)
      return { success: false, message: err.message }
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    try {
      const { cart } = await api.updateCartItem(itemId, quantity)
      dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cart })
    } catch (err) {
      console.error('Error updating cart:', err)
    }
  }

  const removeItem = async (itemId) => {
    try {
      const { cart } = await api.removeFromCart(itemId)
      dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cart })
    } catch (err) {
      console.error('Error removing from cart:', err)
    }
  }

  const clearCart = async () => {
    try {
      await api.clearCart()
      dispatch({ type: CART_ACTIONS.CLEAR_CART })
    } catch (err) {
      console.error('Error clearing cart:', err)
    }
  }

  const applyCoupon = async (code) => {
    try {
      const { cart } = await api.applyCoupon(code)
      dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cart })
      return { success: true, message: 'Coupon applied successfully!' }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  const removeCoupon = async () => {
    try {
      const { cart } = await api.removeCoupon()
      dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cart })
    } catch (err) {
      console.error('Error removing coupon:', err)
    }
  }

  // ... rest of the code ...
}
```

## 📦 Update Products Page

Update `src/pages/ViewCollections.jsx` to fetch from API:

```javascript
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../services/api'

const ViewCollections = () => {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const type = searchParams.get('type')
  const colorParam = searchParams.get('color')
  const countryParam = searchParams.get('country')
  const bestsellersParam = searchParams.get('bestsellers')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const params = {}
        
        if (type) params.theme = type
        if (colorParam) params.color = colorParam
        if (countryParam) params.country = countryParam
        if (bestsellersParam === 'true') params.bestseller = 'true'

        const { products } = await api.getProducts(params)
        setProducts(products)
      } catch (err) {
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [type, colorParam, countryParam, bestsellersParam])

  // ... rest of component
}
```

## 🎫 Update Checkout Page

Update `src/pages/Checkout.jsx` to use API:

```javascript
import { api } from '../services/api'

const Checkout = () => {
  // ... existing code ...

  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true)

      const orderData = {
        shippingAddressId: selectedAddressId,
        paymentMethod: 'cod',
      }

      const { order } = await api.createOrder(orderData)
      
      setOrderPlaced(true)
      setIsProcessing(false)
      
      // Clear cart
      clearCart()
      
      // Navigate to orders page
      setTimeout(() => {
        navigate('/orders')
      }, 2000)
    } catch (err) {
      console.error('Error placing order:', err)
      setIsProcessing(false)
      alert(`Failed to place order: ${err.message}`)
    }
  }

  // ... rest of component
}
```

## 📍 Update Profile Page

Update `src/pages/Profile.jsx` to use API:

```javascript
import { api } from '../services/api'

const Profile = () => {
  const [addresses, setAddresses] = useState([])

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { addresses } = await api.getAddresses()
        setAddresses(addresses)
      } catch (err) {
        console.error('Error fetching addresses:', err)
      }
    }

    if (isAuthenticated()) {
      fetchAddresses()
    }
  }, [isAuthenticated])

  const handleCreateAddress = async (addressData) => {
    try {
      const { address } = await api.createAddress(addressData)
      setAddresses([...addresses, address])
    } catch (err) {
      console.error('Error creating address:', err)
    }
  }

  // ... rest of component
}
```

## 📋 Update Orders Page

Update `src/pages/Orders.jsx` to use API:

```javascript
import { api } from '../services/api'

const Orders = () => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { orders } = await api.getOrders()
        setOrders(orders)
      } catch (err) {
        console.error('Error fetching orders:', err)
      }
    }

    if (isAuthenticated()) {
      fetchOrders()
    }
  }, [isAuthenticated])

  // ... rest of component
}
```

## 🔐 Environment Variables

Create `.env` file in frontend root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## ✅ Testing Checklist

- [ ] User registration and login works
- [ ] Products load from API
- [ ] Cart syncs with API
- [ ] Orders are created via API
- [ ] Addresses are managed via API
- [ ] Coupons are validated via API
- [ ] Error handling works correctly
- [ ] Loading states are shown
- [ ] Token is stored and sent correctly

---

**Happy Integrating! 🚀**

