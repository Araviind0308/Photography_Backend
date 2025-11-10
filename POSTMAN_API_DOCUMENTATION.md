# Harshavardhan Photography API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

---

## 📋 Table of Contents
1. [User Authentication](#user-authentication)
2. [Products](#products)
3. [Cart](#cart)
4. [Orders](#orders)
5. [Addresses](#addresses)
6. [Coupons](#coupons)

---

## 🔐 User Authentication

### 1. Send Verification Code
**POST** `/users/register`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Verification code sent to email",
  "code": "123456",
  "email": "user@example.com"
}
```

**Postman Setup:**
- Method: POST
- URL: `http://localhost:5000/api/users/register`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "test@example.com"
}
```

---

### 2. Login with Code
**POST** `/users/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "user",
    "email": "user@example.com",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

**Postman Setup:**
- Method: POST
- URL: `http://localhost:5000/api/users/login`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "test@example.com",
  "code": "123456"
}
```

---

### 3. Get Current User
**GET** `/users/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "user",
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Postman Setup:**
- Method: GET
- URL: `http://localhost:5000/api/users/me`
- Headers:
  - `Authorization: Bearer <your_token>`
  - `Content-Type: application/json`

---

### 4. Update Current User
**PUT** `/users/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Name"
}
```

**Postman Setup:**
- Method: PUT
- URL: `http://localhost:5000/api/users/me`
- Headers:
  - `Authorization: Bearer <your_token>`
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "name": "New Name"
}
```

---

## 📦 Products

### 1. Get All Products (with filters)
**GET** `/products`

**Query Parameters:**
- `theme` - Filter by theme (e.g., `aerial-views`)
- `color` - Filter by color (e.g., `blue`, `yellow-orange-red`)
- `country` - Filter by country (e.g., `iceland`)
- `bestseller` - Filter bestsellers (`true` or `false`)
- `search` - Search in title/description
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 60)

**Example:**
```
GET /api/products?theme=aerial-views&color=blue&page=1&limit=20
```

**Response:**
```json
{
  "products": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

**Postman Setup:**
- Method: GET
- URL: `http://localhost:5000/api/products?theme=aerial-views&color=blue`
- No headers required (public endpoint)

---

### 2. Get Single Product
**GET** `/products/:id`

**Response:**
```json
{
  "product": {
    "_id": "product_id",
    "title": "Product Title",
    "description": "Product Description",
    "price": 2500,
    "image": "image_url",
    "images": ["url1", "url2"],
    "theme": "aerial-views",
    "color": "blue",
    "country": "iceland",
    "bestseller": true,
    "inStock": true,
    "rating": 4.8,
    "reviews": 45,
    "printSizes": [...],
    "printMaterials": [...],
    "framingOptions": [...]
  }
}
```

**Postman Setup:**
- Method: GET
- URL: `http://localhost:5000/api/products/<product_id>`

---

### 3. Get Themes
**GET** `/products/filters/themes`

**Response:**
```json
{
  "themes": ["aerial-views", "classic-landscapes", "coast-ocean", ...]
}
```

---

### 4. Get Colors
**GET** `/products/filters/colors`

**Response:**
```json
{
  "colors": ["blue", "green", "brown", "white", ...]
}
```

---

### 5. Get Countries
**GET** `/products/filters/countries`

**Response:**
```json
{
  "countries": ["iceland", "norway", "alaska", ...]
}
```

---

## 🛒 Cart

### 1. Get Cart
**GET** `/cart`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "cart": {
    "_id": "cart_id",
    "user": "user_id",
    "items": [
      {
        "_id": "item_id",
        "product": "product_id",
        "name": "Product Name",
        "price": 2500,
        "image": "image_url",
        "size": "60x45",
        "material": "aluminum-dibond",
        "framing": "unframed",
        "quantity": 2
      }
    ],
    "coupon": {
      "code": "DISCOUNT10",
      "discount": 10,
      "discountType": "percentage"
    },
    "subtotal": 5000,
    "discount": 500,
    "total": 4500,
    "itemCount": 2
  }
}
```

**Postman Setup:**
- Method: GET
- URL: `http://localhost:5000/api/cart`
- Headers: `Authorization: Bearer <your_token>`

---

### 2. Add Item to Cart
**POST** `/cart/items`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productId": "product_id",
  "name": "Product Name",
  "price": 2500,
  "image": "image_url",
  "selectedImageIndex": 0,
  "size": "60x45",
  "material": "aluminum-dibond",
  "framing": "unframed",
  "quantity": 1
}
```

**Postman Setup:**
- Method: POST
- URL: `http://localhost:5000/api/cart/items`
- Headers:
  - `Authorization: Bearer <your_token>`
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "productId": "product_id_here",
  "name": "Aerial Landscape I",
  "price": 2500,
  "image": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
  "size": "60x45",
  "material": "aluminum-dibond",
  "framing": "unframed",
  "quantity": 1
}
```

---

### 3. Update Cart Item
**PUT** `/cart/items/:itemId`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "quantity": 3
}
```

**Postman Setup:**
- Method: PUT
- URL: `http://localhost:5000/api/cart/items/<item_id>`
- Headers:
  - `Authorization: Bearer <your_token>`
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "quantity": 3
}
```

---

### 4. Remove Item from Cart
**DELETE** `/cart/items/:itemId`

**Headers:**
```
Authorization: Bearer <token>
```

**Postman Setup:**
- Method: DELETE
- URL: `http://localhost:5000/api/cart/items/<item_id>`
- Headers: `Authorization: Bearer <your_token>`

---

### 5. Clear Cart
**DELETE** `/cart`

**Headers:**
```
Authorization: Bearer <token>
```

**Postman Setup:**
- Method: DELETE
- URL: `http://localhost:5000/api/cart`
- Headers: `Authorization: Bearer <your_token>`

---

### 6. Apply Coupon
**POST** `/cart/coupon`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "code": "DISCOUNT10"
}
```

**Postman Setup:**
- Method: POST
- URL: `http://localhost:5000/api/cart/coupon`
- Headers:
  - `Authorization: Bearer <your_token>`
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "code": "DISCOUNT10"
}
```

---

### 7. Remove Coupon
**DELETE** `/cart/coupon`

**Headers:**
```
Authorization: Bearer <token>
```

**Postman Setup:**
- Method: DELETE
- URL: `http://localhost:5000/api/cart/coupon`
- Headers: `Authorization: Bearer <your_token>`

---

## 📦 Orders

### 1. Get All Orders
**GET** `/orders`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "orders": [
    {
      "_id": "order_id",
      "orderNumber": "ORD-123456",
      "items": [...],
      "total": 4500,
      "status": "pending",
      "paymentStatus": "pending",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

**Postman Setup:**
- Method: GET
- URL: `http://localhost:5000/api/orders`
- Headers: `Authorization: Bearer <your_token>`

---

### 2. Get Single Order
**GET** `/orders/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Postman Setup:**
- Method: GET
- URL: `http://localhost:5000/api/orders/<order_id>`
- Headers: `Authorization: Bearer <your_token>`

---

### 3. Create Order
**POST** `/orders`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "shippingAddressId": "address_id",
  "paymentMethod": "cod"
}
```

**OR with inline address:**
```json
{
  "name": "John Doe",
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "zipCode": "400001",
  "country": "India",
  "phone": "+91 1234567890",
  "paymentMethod": "cod"
}
```

**Postman Setup:**
- Method: POST
- URL: `http://localhost:5000/api/orders`
- Headers:
  - `Authorization: Bearer <your_token>`
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "shippingAddressId": "address_id_here",
  "paymentMethod": "cod"
}
```

---

## 📍 Addresses

### 1. Get All Addresses
**GET** `/addresses`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "addresses": [
    {
      "_id": "address_id",
      "name": "John Doe",
      "address": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zipCode": "400001",
      "country": "India",
      "phone": "+91 1234567890",
      "isDefault": true
    }
  ]
}
```

**Postman Setup:**
- Method: GET
- URL: `http://localhost:5000/api/addresses`
- Headers: `Authorization: Bearer <your_token>`

---

### 2. Get Single Address
**GET** `/addresses/:id`

**Postman Setup:**
- Method: GET
- URL: `http://localhost:5000/api/addresses/<address_id>`
- Headers: `Authorization: Bearer <your_token>`

---

### 3. Create Address
**POST** `/addresses`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Doe",
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "zipCode": "400001",
  "country": "India",
  "phone": "+91 1234567890",
  "isDefault": true
}
```

**Postman Setup:**
- Method: POST
- URL: `http://localhost:5000/api/addresses`
- Headers:
  - `Authorization: Bearer <your_token>`
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "name": "John Doe",
  "address": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "zipCode": "400001",
  "country": "India",
  "phone": "+91 1234567890",
  "isDefault": true
}
```

---

### 4. Update Address
**PUT** `/addresses/:id`

**Postman Setup:**
- Method: PUT
- URL: `http://localhost:5000/api/addresses/<address_id>`
- Headers:
  - `Authorization: Bearer <your_token>`
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "name": "Updated Name",
  "isDefault": true
}
```

---

### 5. Delete Address
**DELETE** `/addresses/:id`

**Postman Setup:**
- Method: DELETE
- URL: `http://localhost:5000/api/addresses/<address_id>`
- Headers: `Authorization: Bearer <your_token>`

---

## 🎟️ Coupons

### 1. Get Active Coupons
**GET** `/coupons`

**Response:**
```json
{
  "coupons": [
    {
      "code": "DISCOUNT10",
      "description": "10% off on all orders",
      "discount": 10,
      "discountType": "percentage",
      "minAmount": 1000,
      "maxDiscount": 500,
      "validUntil": "2025-12-31T23:59:59.000Z"
    }
  ]
}
```

**Postman Setup:**
- Method: GET
- URL: `http://localhost:5000/api/coupons`
- No headers required (public endpoint)

---

### 2. Validate Coupon
**GET** `/coupons/:code?orderAmount=5000`

**Query Parameters:**
- `orderAmount` - Order amount to validate against

**Response:**
```json
{
  "valid": true,
  "coupon": {
    "code": "DISCOUNT10",
    "discount": 10,
    "discountType": "percentage",
    "minAmount": 1000,
    "maxDiscount": 500,
    "description": "10% off on all orders"
  }
}
```

**Postman Setup:**
- Method: GET
- URL: `http://localhost:5000/api/coupons/DISCOUNT10?orderAmount=5000`
- No headers required (public endpoint)

---

## 🔧 Postman Collection Setup

### Step 1: Create Environment Variables
1. Click on "Environments" in Postman
2. Create new environment: "Harshavardhan Photography API"
3. Add variables:
   - `base_url`: `http://localhost:5000/api`
   - `token`: (leave empty, will be set after login)

### Step 2: Create Collection
1. Create new collection: "Harshavardhan Photography"
2. Add all the endpoints above
3. Use `{{base_url}}` in URLs
4. Use `{{token}}` in Authorization headers

### Step 3: Test Flow
1. **Register/Login** → Save token to environment variable
2. **Get Products** → Test filters
3. **Add to Cart** → Test cart operations
4. **Create Address** → Test address CRUD
5. **Apply Coupon** → Test coupon validation
6. **Create Order** → Complete order flow

### Step 4: Auto-save Token
In the Login request, add this to "Tests" tab:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.token);
}
```

---

## 📝 Notes

1. **All timestamps are in ISO 8601 format**
2. **All prices are in INR (₹)**
3. **JWT tokens expire in 7 days (configurable)**
4. **Coupon codes are case-insensitive**
5. **Product filters are case-sensitive (use lowercase)**
6. **Pagination starts from page 1**

---

## 🐛 Error Responses

All errors follow this format:
```json
{
  "message": "Error message here"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## ✅ Testing Checklist

- [ ] User registration and login
- [ ] Get products with filters
- [ ] Get single product
- [ ] Add item to cart
- [ ] Update cart item quantity
- [ ] Remove item from cart
- [ ] Apply coupon to cart
- [ ] Remove coupon from cart
- [ ] Create address
- [ ] Update address
- [ ] Delete address
- [ ] Create order
- [ ] Get all orders
- [ ] Get single order

---

**Happy Testing! 🚀**

