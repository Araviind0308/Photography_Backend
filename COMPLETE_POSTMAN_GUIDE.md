# Complete Postman API Testing Guide
## Harshavardhan Photography Backend API

**Base URL:** `http://localhost:5000/api`

---

## 📋 Quick Setup

### Step 1: Create Postman Environment
1. Open Postman
2. Click **Environments** → **Create Environment**
3. Add variables:
   - `base_url`: `http://localhost:5000/api`
   - `admin_token`: (leave empty, will be set after login)
   - `user_token`: (leave empty, will be set after login)
   - `product_id`: (leave empty, will be set after creating product)
   - `banner_id`: (leave empty, will be set after creating banner)
   - `testimonial_id`: (leave empty, will be set after creating testimonial)

### Step 2: Use Variables
In all requests, use: `{{base_url}}/endpoint`

---

## 🔐 1. ADMIN AUTHENTICATION

### 1.1 Admin Login
**POST** `{{base_url}}/admin/login`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "_id": "...",
    "email": "admin@example.com"
  }
}
```

**⚠️ IMPORTANT:** Copy the `token` and save it as `{{admin_token}}` in your environment.

**Authorization Setup:**
- Go to **Authorization** tab
- Type: **Bearer Token**
- Token: `{{admin_token}}`

---

## 👤 2. USER AUTHENTICATION

### 2.1 Register (Send Verification Code)
**POST** `{{base_url}}/users/register`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
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

### 2.2 Login with Code
**POST** `{{base_url}}/users/login`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
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
    "_id": "...",
    "email": "user@example.com"
  },
  "token": "jwt_token_here"
}
```

**Save token as `{{user_token}}`**

### 2.3 Get Current User
**GET** `{{base_url}}/users/me`

**Headers:**
```
Authorization: Bearer {{user_token}}
```

### 2.4 Update User Profile
**PUT** `{{base_url}}/users/me`

**Headers:**
```
Authorization: Bearer {{user_token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "John Doe",
  "phone": "+1234567890"
}
```

---

## 🖼️ 3. PRODUCTS (PUBLIC - No Auth Required)

### 3.1 Get All Products
**GET** `{{base_url}}/products`

**Query Parameters (Optional):**
- `theme`: `aerial-views`
- `color`: `blue`
- `country`: `iceland`
- `bestseller`: `true`
- `search`: `landscape`
- `page`: `1`
- `limit`: `20`

**Example:**
```
{{base_url}}/products?theme=aerial-views&color=blue&bestseller=true
```

### 3.2 Get Single Product
**GET** `{{base_url}}/products/:id`

**Example:**
```
{{base_url}}/products/65a1b2c3d4e5f6g7h8i9j0k1
```

### 3.3 Get Product Filters
**GET** `{{base_url}}/products/filters/themes`
**GET** `{{base_url}}/products/filters/colors`
**GET** `{{base_url}}/products/filters/countries`

### 3.4 Get Bestsellers
**GET** `{{base_url}}/products/bestsellers`

---

## 📦 4. PRODUCTS (ADMIN - Auth Required)

### 4.1 Create Product
**POST** `{{base_url}}/admin/products`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Body Type:** `form-data` (NOT raw JSON - because of file uploads)

**Form Data Fields:**

**Required:**
| Key | Type | Value |
|-----|------|-------|
| `title` | Text | `Aerial Landscape I` |
| `price` | Text | `2500` |
| `subCategory` | Text | `SUBCATEGORY_ID` |

**Optional:**
| Key | Type | Value |
|-----|------|-------|
| `description` | Text | `Stunning aerial view` |
| `originalPrice` | Text | `3000` |
| `currency` | Text | `INR` |
| `isPublished` | Text | `true` |
| `theme` | Text | `aerial-views` |
| `color` | Text | `blue` |
| `country` | Text | `iceland` |
| `bestseller` | Text | `true` |
| `inStock` | Text | `true` |
| `rating` | Text | `4.8` |
| `reviews` | Text | `42` |
| `discount` | Text | `17` |
| `coverImage` | File | [Select image file] |
| `galleryImages` | File | [Select multiple files] |
| `printSizes` | Text | `[{"id":"small","name":"Small (8x10)","width":8,"height":10,"price":0}]` |
| `printMaterials` | Text | `[{"id":"paper","name":"Premium Paper","price":0}]` |
| `framingOptions` | Text | `[{"id":"none","name":"No Frame","price":0,"frameType":"none"}]` |

### 4.2 Get All Products (Admin)
**GET** `{{base_url}}/admin/products`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Query Parameters:**
- `subCategory`: `SUBCATEGORY_ID`

### 4.3 Get Single Product (Admin)
**GET** `{{base_url}}/admin/products/:id`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

### 4.4 Update Product
**PUT** `{{base_url}}/admin/products/:id`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Body Type:** `form-data`

**Form Data:** (Same as Create, all fields optional)

**Special Field:**
| Key | Type | Value |
|-----|------|-------|
| `removeGallery` | Text | `["/uploads/products/old-image.jpg"]` |

### 4.5 Delete Product
**DELETE** `{{base_url}}/admin/products/:id`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

---

## 🎨 5. BANNERS (PUBLIC - No Auth Required)

### 5.1 Get All Active Banners
**GET** `{{base_url}}/banners`

**Response:**
```json
{
  "banners": [
    {
      "_id": "...",
      "title": "ELEVATE YOUR WALLS",
      "subtitle": "Discover stunning perspectives",
      "image": "/uploads/banners/banner1.jpg",
      "buttonText": "SHOP NOW",
      "buttonLink": "/ViewCollections",
      "order": 1,
      "isActive": true
    }
  ]
}
```

---

## 🎨 6. BANNERS (ADMIN - Auth Required)

### 6.1 Create Banner
**POST** `{{base_url}}/admin/banners`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Body Type:** `form-data`

**Form Data:**
| Key | Type | Value |
|-----|------|-------|
| `title` | Text | `ELEVATE YOUR WALLS` |
| `subtitle` | Text | `Discover stunning perspectives` |
| `buttonText` | Text | `SHOP NOW` |
| `buttonLink` | Text | `/ViewCollections` |
| `order` | Text | `1` |
| `isActive` | Text | `true` |
| `image` | File | [Select image file] |

### 6.2 Get All Banners (Admin)
**GET** `{{base_url}}/admin/banners`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Query Parameters:**
- `isActive`: `true` or `false`

### 6.3 Get Single Banner
**GET** `{{base_url}}/admin/banners/:id`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

### 6.4 Update Banner
**PUT** `{{base_url}}/admin/banners/:id`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Body Type:** `form-data` (Same as Create, all fields optional)

### 6.5 Delete Banner
**DELETE** `{{base_url}}/admin/banners/:id`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

---

## 💬 7. TESTIMONIALS (PUBLIC - No Auth Required)

### 7.1 Get All Active Testimonials
**GET** `{{base_url}}/testimonials`

**Response:**
```json
{
  "testimonials": [
    {
      "_id": "...",
      "name": "Sarah Johnson",
      "location": "New York, USA",
      "rating": 5,
      "comment": "Absolutely stunning prints!",
      "image": "/uploads/testimonials/customer1.jpg",
      "backgroundImage": "/uploads/testimonials/bg1.jpg",
      "order": 1
    }
  ]
}
```

---

## 💬 8. TESTIMONIALS (ADMIN - Auth Required)

### 8.1 Create Testimonial
**POST** `{{base_url}}/admin/testimonials`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Body Type:** `form-data`

**Form Data:**
| Key | Type | Value |
|-----|------|-------|
| `name` | Text | `Sarah Johnson` |
| `location` | Text | `New York, USA` |
| `rating` | Text | `5` |
| `comment` | Text | `Absolutely stunning prints!` |
| `order` | Text | `1` |
| `isActive` | Text | `true` |
| `image` | File | [Select customer image] |
| `backgroundImage` | File | [Select background image] |

### 8.2 Get All Testimonials (Admin)
**GET** `{{base_url}}/admin/testimonials`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Query Parameters:**
- `isActive`: `true` or `false`

### 8.3 Get Single Testimonial
**GET** `{{base_url}}/admin/testimonials/:id`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

### 8.4 Update Testimonial
**PUT** `{{base_url}}/admin/testimonials/:id`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Body Type:** `form-data` (Same as Create, all fields optional)

### 8.5 Delete Testimonial
**DELETE** `{{base_url}}/admin/testimonials/:id`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

---

## 🛒 9. CART (USER - Auth Required)

### 9.1 Get Cart
**GET** `{{base_url}}/cart`

**Headers:**
```
Authorization: Bearer {{user_token}}
```

### 9.2 Add Item to Cart
**POST** `{{base_url}}/cart/items`

**Headers:**
```
Authorization: Bearer {{user_token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "productId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "quantity": 2,
  "options": {
    "printSize": "medium",
    "printMaterial": "canvas",
    "framingOption": "black"
  }
}
```

### 9.3 Update Cart Item
**PUT** `{{base_url}}/cart/items/:itemId`

**Headers:**
```
Authorization: Bearer {{user_token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "quantity": 3
}
```

### 9.4 Remove Cart Item
**DELETE** `{{base_url}}/cart/items/:itemId`

**Headers:**
```
Authorization: Bearer {{user_token}}
```

### 9.5 Apply Coupon
**POST** `{{base_url}}/cart/apply-coupon`

**Headers:**
```
Authorization: Bearer {{user_token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "code": "SAVE20"
}
```

### 9.6 Remove Coupon
**POST** `{{base_url}}/cart/remove-coupon`

**Headers:**
```
Authorization: Bearer {{user_token}}
```

### 9.7 Clear Cart
**DELETE** `{{base_url}}/cart`

**Headers:**
```
Authorization: Bearer {{user_token}}
```

---

## 📦 10. ORDERS (USER - Auth Required)

### 10.1 Create Order
**POST** `{{base_url}}/orders`

**Headers:**
```
Authorization: Bearer {{user_token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "items": [
    {
      "productId": "65a1b2c3d4e5f6g7h8i9j0k1",
      "quantity": 2,
      "price": 2500,
      "options": {
        "printSize": "medium",
        "printMaterial": "canvas",
        "framingOption": "black"
      }
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "card",
  "couponCode": "SAVE20"
}
```

### 10.2 Get All Orders
**GET** `{{base_url}}/orders`

**Headers:**
```
Authorization: Bearer {{user_token}}
```

### 10.3 Get Single Order
**GET** `{{base_url}}/orders/:id`

**Headers:**
```
Authorization: Bearer {{user_token}}
```

---

## 📍 11. ADDRESSES (USER - Auth Required)

### 11.1 Get All Addresses
**GET** `{{base_url}}/addresses`

**Headers:**
```
Authorization: Bearer {{user_token}}
```

### 11.2 Add Address
**POST** `{{base_url}}/addresses`

**Headers:**
```
Authorization: Bearer {{user_token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "isDefault": true
}
```

### 11.3 Update Address
**PUT** `{{base_url}}/addresses/:id`

**Headers:**
```
Authorization: Bearer {{user_token}}
Content-Type: application/json
```

**Body (raw JSON):** (Same as Add Address, all fields optional)

### 11.4 Delete Address
**DELETE** `{{base_url}}/addresses/:id`

**Headers:**
```
Authorization: Bearer {{user_token}}
```

---

## 🎟️ 12. COUPONS (PUBLIC - No Auth Required)

### 12.1 Validate Coupon
**GET** `{{base_url}}/coupons/:code`

**Example:**
```
{{base_url}}/coupons/SAVE20
```

**Response:**
```json
{
  "coupon": {
    "_id": "...",
    "code": "SAVE20",
    "discount": 20,
    "type": "percentage",
    "minPurchase": 1000,
    "maxDiscount": 500,
    "isActive": true,
    "expiresAt": "2024-12-31T23:59:59.000Z"
  }
}
```

---

## 📂 13. CATEGORIES (ADMIN - Auth Required)

### 13.1 Create Category
**POST** `{{base_url}}/admin/categories`

**Headers:**
```
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Landscapes",
  "description": "Beautiful landscape photography"
}
```

### 13.2 Get All Categories
**GET** `{{base_url}}/admin/categories`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

### 13.3 Get Single Category
**GET** `{{base_url}}/admin/categories/:id`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

### 13.4 Update Category
**PUT** `{{base_url}}/admin/categories/:id`

**Headers:**
```
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

### 13.5 Delete Category
**DELETE** `{{base_url}}/admin/categories/:id`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

---

## 📂 14. SUBCATEGORIES (ADMIN - Auth Required)

### 14.1 Create SubCategory
**POST** `{{base_url}}/admin/subcategories`

**Headers:**
```
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "category": "CATEGORY_ID",
  "name": "Aerial Views",
  "description": "Stunning aerial photography"
}
```

### 14.2 Get All SubCategories
**GET** `{{base_url}}/admin/subcategories`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

### 14.3 Get Single SubCategory
**GET** `{{base_url}}/admin/subcategories/:id`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

### 14.4 Update SubCategory
**PUT** `{{base_url}}/admin/subcategories/:id`

**Headers:**
```
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

### 14.5 Delete SubCategory
**DELETE** `{{base_url}}/admin/subcategories/:id`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

---

## 🧪 Testing Checklist

### Authentication
- [ ] Admin login successful
- [ ] User registration (send code)
- [ ] User login (with code)
- [ ] Get current user profile

### Products (Public)
- [ ] Get all products
- [ ] Get products with filters
- [ ] Get single product
- [ ] Get themes
- [ ] Get colors
- [ ] Get countries
- [ ] Get bestsellers

### Products (Admin)
- [ ] Create product (with images)
- [ ] Get all products
- [ ] Get single product
- [ ] Update product
- [ ] Delete product

### Banners
- [ ] Get active banners (public)
- [ ] Create banner (admin)
- [ ] Get all banners (admin)
- [ ] Update banner (admin)
- [ ] Delete banner (admin)

### Testimonials
- [ ] Get active testimonials (public)
- [ ] Create testimonial (admin)
- [ ] Get all testimonials (admin)
- [ ] Update testimonial (admin)
- [ ] Delete testimonial (admin)

### Cart
- [ ] Get cart
- [ ] Add item to cart
- [ ] Update cart item
- [ ] Remove cart item
- [ ] Apply coupon
- [ ] Remove coupon
- [ ] Clear cart

### Orders
- [ ] Create order
- [ ] Get all orders
- [ ] Get single order

### Addresses
- [ ] Get all addresses
- [ ] Add address
- [ ] Update address
- [ ] Delete address

### Coupons
- [ ] Validate coupon

---

## 💡 Tips for Postman

### 1. Save Responses as Variables
After creating resources, save IDs:
- In **Tests** tab, add:
```javascript
if (pm.response.code === 201) {
    const jsonData = pm.response.json();
    pm.environment.set("product_id", jsonData.product._id);
}
```

### 2. Use Pre-request Scripts
To auto-set tokens:
```javascript
pm.request.headers.add({
    key: 'Authorization',
    value: 'Bearer ' + pm.environment.get('admin_token')
});
```

### 3. Collection Organization
Create folders:
- `01. Authentication`
- `02. Products (Public)`
- `03. Products (Admin)`
- `04. Banners`
- `05. Testimonials`
- `06. Cart`
- `07. Orders`
- `08. Addresses`
- `09. Coupons`

### 4. File Uploads
- Use **form-data** (not raw JSON) for file uploads
- Select **File** type for file fields
- For JSON arrays in form-data, use **Text** type

### 5. Error Handling
Common errors:
- **401**: Token expired or missing
- **400**: Missing required fields
- **404**: Resource not found
- **500**: Server error (check server logs)

---

## 📝 Example Complete Flow

### 1. Admin Login
```
POST {{base_url}}/admin/login
→ Save token as {{admin_token}}
```

### 2. Create Product
```
POST {{base_url}}/admin/products
Headers: Authorization: Bearer {{admin_token}}
Body: form-data with product details and images
→ Save product._id as {{product_id}}
```

### 3. Get Product (Public)
```
GET {{base_url}}/products/{{product_id}}
```

### 4. User Registration
```
POST {{base_url}}/users/register
Body: { "email": "user@example.com" }
→ Note the verification code
```

### 5. User Login
```
POST {{base_url}}/users/login
Body: { "email": "user@example.com", "code": "123456" }
→ Save token as {{user_token}}
```

### 6. Add to Cart
```
POST {{base_url}}/cart/items
Headers: Authorization: Bearer {{user_token}}
Body: { "productId": "{{product_id}}", "quantity": 1 }
```

### 7. Create Order
```
POST {{base_url}}/orders
Headers: Authorization: Bearer {{user_token}}
Body: { order details }
```

---

## 🔗 Quick Reference

| Endpoint | Method | Auth | Body Type |
|----------|--------|------|-----------|
| `/admin/login` | POST | No | JSON |
| `/users/register` | POST | No | JSON |
| `/users/login` | POST | No | JSON |
| `/products` | GET | No | - |
| `/products/:id` | GET | No | - |
| `/admin/products` | POST | Admin | form-data |
| `/admin/products/:id` | PUT | Admin | form-data |
| `/admin/products/:id` | DELETE | Admin | - |
| `/banners` | GET | No | - |
| `/admin/banners` | POST | Admin | form-data |
| `/testimonials` | GET | No | - |
| `/admin/testimonials` | POST | Admin | form-data |
| `/cart` | GET | User | - |
| `/cart/items` | POST | User | JSON |
| `/orders` | POST | User | JSON |
| `/addresses` | GET | User | - |
| `/addresses` | POST | User | JSON |
| `/coupons/:code` | GET | No | - |

---

**Happy Testing! 🚀**

