# Harshavardhan Photography Backend API

A comprehensive Node.js/Express backend API for the Harshavardhan Photography e-commerce platform.

## 🚀 Features

- ✅ User Authentication (Email + OTP)
- ✅ Product Management with Filters
- ✅ Shopping Cart
- ✅ Order Management
- ✅ Address Management
- ✅ Coupon System
- ✅ JWT Authentication
- ✅ MongoDB Database
- ✅ RESTful API Design

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
```bash
cd "d:\devanSir\UX_Website\Harshavardhan Photography"
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```bash
cp .env.example .env
```

4. **Update `.env` file with your configuration**
```env
MONGODB_URI=mongodb://localhost:27017/harshavardhan-photography
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
```

5. **Start MongoDB**
```bash
# Make sure MongoDB is running on your system
# Windows: MongoDB should start automatically as a service
# Or run: mongod
```

6. **Start the server**
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
Harshavardhan Photography/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── Admin/                # Admin controllers
│   ├── Public/               # Public controllers (products, coupons)
│   └── User/                 # User controllers (cart, orders, addresses)
├── middleware/
│   ├── auth.js               # JWT authentication middleware
│   └── multer.js             # File upload middleware
├── models/
│   ├── Admin/                # Admin models (Product, Category, etc.)
│   └── User/                 # User models (User, Cart, Order, Address)
├── routes/
│   ├── Admin/                # Admin routes
│   ├── Public/               # Public routes
│   └── User/                 # User routes
├── uploads/                  # Uploaded files
├── app.js                    # Main application file
└── package.json
```

## 🔌 API Endpoints

### Public Endpoints (No Authentication)
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get single product
- `GET /api/products/filters/themes` - Get all themes
- `GET /api/products/filters/colors` - Get all colors
- `GET /api/products/filters/countries` - Get all countries
- `GET /api/coupons` - Get active coupons
- `GET /api/coupons/:code` - Validate coupon

### User Endpoints (Authentication Required)
- `POST /api/users/register` - Send verification code
- `POST /api/users/login` - Login with code
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update current user

### Cart Endpoints (Authentication Required)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:itemId` - Update cart item
- `DELETE /api/cart/items/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear cart
- `POST /api/cart/coupon` - Apply coupon
- `DELETE /api/cart/coupon` - Remove coupon

### Order Endpoints (Authentication Required)
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order

### Address Endpoints (Authentication Required)
- `GET /api/addresses` - Get all addresses
- `GET /api/addresses/:id` - Get single address
- `POST /api/addresses` - Create address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address

## 📚 API Documentation

See [POSTMAN_API_DOCUMENTATION.md](./POSTMAN_API_DOCUMENTATION.md) for detailed API documentation with Postman examples.

## 🧪 Testing with Postman

1. **Import Postman Collection**
   - Create a new collection in Postman
   - Add all endpoints from the documentation

2. **Set up Environment Variables**
   - Create environment: "Harshavardhan Photography API"
   - Add variables:
     - `base_url`: `http://localhost:5000/api`
     - `token`: (will be set after login)

3. **Test Flow**
   - Register/Login → Save token
   - Get Products → Test filters
   - Add to Cart → Test cart operations
   - Create Address → Test address CRUD
   - Apply Coupon → Test coupon validation
   - Create Order → Complete order flow

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_token>
```

To get a token:
1. POST `/api/users/register` with email
2. POST `/api/users/login` with email and code
3. Use the returned token in subsequent requests

## 🗄️ Database Models

### User
- Email-based authentication
- Name, email, role

### Product
- Title, description, price
- Images (cover + gallery)
- Filters: theme, color, country, bestseller
- Print options: sizes, materials, framing

### Cart
- User-specific cart
- Items with product details
- Coupon support

### Order
- Order items
- Shipping address
- Payment status
- Order status

### Address
- User addresses
- Default address support

### Coupon
- Code, discount, type
- Validity dates
- Usage limits

## 🚀 Frontend Integration

See [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md) for frontend integration guide.

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |

## 🐛 Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check `MONGODB_URI` in `.env` file
- Verify MongoDB connection string format

### Port Already in Use
- Change `PORT` in `.env` file
- Or stop the process using port 5000

### JWT Token Invalid
- Check `JWT_SECRET` in `.env` file
- Make sure token is not expired
- Verify token format in Authorization header

## 📄 License

ISC

## 👨‍💻 Author

Harshavardhan Photography

---

**Happy Coding! 🚀**

