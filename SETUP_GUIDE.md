# 🚀 Complete Setup Guide

## ✅ What Has Been Created

### 📁 Models
- ✅ `models/User/Address.js` - User addresses
- ✅ `models/User/Cart.js` - Shopping cart
- ✅ `models/User/Order.js` - Orders
- ✅ `models/Admin/Coupon.js` - Coupons
- ✅ `models/Admin/Product.js` - Updated with filters (theme, color, country, bestseller)

### 🎮 Controllers
- ✅ `controllers/User/addressController.js` - Address CRUD
- ✅ `controllers/User/cartController.js` - Cart operations
- ✅ `controllers/User/orderController.js` - Order management
- ✅ `controllers/Public/productController.js` - Public product APIs
- ✅ `controllers/Public/couponController.js` - Coupon validation

### 🛣️ Routes
- ✅ `routes/User/addressRoutes.js` - Address routes
- ✅ `routes/User/cartRoutes.js` - Cart routes
- ✅ `routes/User/orderRoutes.js` - Order routes
- ✅ `routes/Public/productRoutes.js` - Product routes
- ✅ `routes/Public/couponRoutes.js` - Coupon routes

### 📚 Documentation
- ✅ `POSTMAN_API_DOCUMENTATION.md` - Complete API documentation
- ✅ `README.md` - Project setup guide
- ✅ `FRONTEND_INTEGRATION.md` - Frontend integration guide
- ✅ `SETUP_GUIDE.md` - This file

### ⚙️ Configuration
- ✅ `app.js` - Updated with all routes and CORS
- ✅ `.env.example` - Environment variables template

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd "d:\devanSir\UX_Website\Harshavardhan Photography"
npm install
```

### 2. Setup Environment
```bash
# Create .env file
cp .env.example .env

# Edit .env file with your MongoDB URI
MONGODB_URI=mongodb://localhost:27017/harshavardhan-photography
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
```

### 3. Start MongoDB
```bash
# Make sure MongoDB is running
# Windows: Usually runs as a service
# Or start manually: mongod
```

### 4. Start Server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

Server will start on: `http://localhost:5000`

## 🧪 Testing with Postman

### Step 1: Create Environment
1. Open Postman
2. Click "Environments" → "Create Environment"
3. Name: "Harshavardhan Photography API"
4. Add variables:
   - `base_url`: `http://localhost:5000/api`
   - `token`: (leave empty)

### Step 2: Test Authentication
1. **Register** (POST `/api/users/register`)
   - Body: `{ "email": "test@example.com" }`
   - Save the code from response

2. **Login** (POST `/api/users/login`)
   - Body: `{ "email": "test@example.com", "code": "123456" }`
   - Copy the token from response
   - Set `token` variable in environment

3. **Get Current User** (GET `/api/users/me`)
   - Headers: `Authorization: Bearer {{token}}`

### Step 3: Test Products
1. **Get All Products** (GET `/api/products`)
   - No authentication needed
   - Try filters: `?theme=aerial-views&color=blue`

2. **Get Single Product** (GET `/api/products/:id`)
   - Replace `:id` with actual product ID

### Step 4: Test Cart
1. **Get Cart** (GET `/api/cart`)
   - Headers: `Authorization: Bearer {{token}}`

2. **Add to Cart** (POST `/api/cart/items`)
   - Headers: `Authorization: Bearer {{token}}`
   - Body:
   ```json
   {
     "productId": "product_id",
     "name": "Product Name",
     "price": 2500,
     "image": "image_url",
     "quantity": 1
   }
   ```

3. **Apply Coupon** (POST `/api/cart/coupon`)
   - Headers: `Authorization: Bearer {{token}}`
   - Body: `{ "code": "DISCOUNT10" }`

### Step 5: Test Orders
1. **Create Address** (POST `/api/addresses`)
   - Headers: `Authorization: Bearer {{token}}`
   - Body:
   ```json
   {
     "name": "John Doe",
     "address": "123 Main St",
     "city": "Mumbai",
     "state": "Maharashtra",
     "zipCode": "400001",
     "country": "India"
   }
   ```

2. **Create Order** (POST `/api/orders`)
   - Headers: `Authorization: Bearer {{token}}`
   - Body:
   ```json
   {
     "shippingAddressId": "address_id",
     "paymentMethod": "cod"
   }
   ```

3. **Get Orders** (GET `/api/orders`)
   - Headers: `Authorization: Bearer {{token}}`

## 📋 API Endpoints Summary

### Public (No Auth)
- `GET /api/products` - Get products with filters
- `GET /api/products/:id` - Get single product
- `GET /api/products/filters/themes` - Get themes
- `GET /api/products/filters/colors` - Get colors
- `GET /api/products/filters/countries` - Get countries
- `GET /api/coupons` - Get active coupons
- `GET /api/coupons/:code` - Validate coupon

### User (Auth Required)
- `POST /api/users/register` - Send verification code
- `POST /api/users/login` - Login with code
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update current user

### Cart (Auth Required)
- `GET /api/cart` - Get cart
- `POST /api/cart/items` - Add item
- `PUT /api/cart/items/:itemId` - Update item
- `DELETE /api/cart/items/:itemId` - Remove item
- `DELETE /api/cart` - Clear cart
- `POST /api/cart/coupon` - Apply coupon
- `DELETE /api/cart/coupon` - Remove coupon

### Orders (Auth Required)
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order

### Addresses (Auth Required)
- `GET /api/addresses` - Get all addresses
- `GET /api/addresses/:id` - Get single address
- `POST /api/addresses` - Create address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address

## 🔗 Frontend Integration

See `FRONTEND_INTEGRATION.md` for complete frontend integration guide.

### Quick Integration Steps:
1. Create `src/services/api.js` with API methods
2. Update `AuthContext` to use API
3. Update `CartContext` to use API
4. Update pages to fetch from API
5. Add `.env` file with `VITE_API_BASE_URL`

## 📝 Important Notes

1. **CORS is enabled** - Frontend can call API from different origin
2. **JWT tokens expire in 7 days** - Configurable in `.env`
3. **All prices are in INR (₹)**
4. **Product filters are case-sensitive** - Use lowercase
5. **Coupon codes are case-insensitive** - Auto-uppercase
6. **Cart is user-specific** - One cart per user
7. **Orders are user-specific** - Users can only see their orders

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check MongoDB is running
- Verify `MONGODB_URI` in `.env`
- Test connection: `mongosh "your_connection_string"`

### Port Already in Use
- Change `PORT` in `.env`
- Or kill process: `netstat -ano | findstr :5000`

### JWT Token Invalid
- Check `JWT_SECRET` in `.env`
- Verify token format in Authorization header
- Token might be expired (7 days default)

### CORS Error
- Make sure CORS is enabled in `app.js`
- Check frontend URL is allowed
- Verify API base URL in frontend

## ✅ Next Steps

1. ✅ Backend is ready
2. ✅ API documentation is complete
3. ✅ Postman testing guide is ready
4. ⏭️ Integrate with frontend
5. ⏭️ Test all endpoints
6. ⏭️ Deploy to production

## 📞 Support

For issues or questions:
1. Check `POSTMAN_API_DOCUMENTATION.md` for API details
2. Check `FRONTEND_INTEGRATION.md` for frontend integration
3. Check console logs for errors
4. Verify environment variables

---

**Happy Coding! 🚀**

