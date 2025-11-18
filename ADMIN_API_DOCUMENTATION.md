# Admin API Documentation

Complete API documentation for the Harshavardhan Photography Admin Panel.

## Base URL

```
http://localhost:5000/api/admin
```

## Authentication

All admin endpoints (except login) require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### POST /admin/login

Login as admin and get authentication token.

**Request Body:**
```json
{
  "email": "demo@gmail.com",
  "password": "demo123"
}
```

**Response:**
```json
{
  "admin": {
    "id": "admin_id",
    "email": "demo@gmail.com",
    "name": "Admin",
    "role": "admin"
  },
  "token": "jwt_token_here"
}
```

**Default Credentials:**
- Email: `demo@gmail.com`
- Password: `demo123`

---

### GET /admin/me

Get current admin profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "admin": {
    "_id": "admin_id",
    "email": "demo@gmail.com",
    "name": "Admin",
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Products Endpoints

### GET /admin/products

Get all products.

**Query Parameters:**
- `subCategory` (optional): Filter by subcategory ID

**Response:**
```json
{
  "products": [
    {
      "_id": "product_id",
      "title": "Product Title",
      "description": "Product description",
      "price": 10000,
      "originalPrice": 12000,
      "discount": 10,
      "currency": "INR",
      "coverImage": "/uploads/products/cover.jpg",
      "galleryImages": ["/uploads/products/gallery1.jpg"],
      "subCategory": {
        "_id": "subcategory_id",
        "name": "SubCategory Name",
        "category": {
          "_id": "category_id",
          "name": "Category Name"
        }
      },
      "theme": "aerial-views",
      "color": "blue",
      "country": "iceland",
      "bestseller": true,
      "inStock": true,
      "rating": 4.5,
      "reviews": 10,
      "isPublished": true,
      "printSizes": [],
      "printMaterials": [],
      "framingOptions": [],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### GET /admin/products/:id

Get single product by ID.

**Response:**
```json
{
  "product": {
    "_id": "product_id",
    "title": "Product Title",
    // ... same structure as list
  }
}
```

---

### POST /admin/products

Create a new product.

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `title` (required): Product title
- `subCategory` (optional): SubCategory ID
- `description` (optional): Product description
- `price` (required): Product price
- `originalPrice` (optional): Original price
- `discount` (optional): Discount percentage (0-100)
- `currency` (optional): Currency code (default: "INR")
- `isPublished` (optional): Boolean (default: true)
- `theme` (optional): Theme filter
- `color` (optional): Color filter
- `country` (optional): Country filter
- `bestseller` (optional): Boolean (default: false)
- `inStock` (optional): Boolean (default: true)
- `rating` (optional): Number (0-5)
- `reviews` (optional): Number of reviews
- `printSizes` (optional): JSON string array
- `printMaterials` (optional): JSON string array
- `framingOptions` (optional): JSON string array
- `coverImage` (optional): Image file
- `galleryImages` (optional): Multiple image files

**Response:**
```json
{
  "product": {
    "_id": "product_id",
    "title": "Product Title",
    // ... product object
  }
}
```

---

### PUT /admin/products/:id

Update a product.

**Content-Type:** `multipart/form-data`

**Form Fields:** Same as POST /admin/products

**Response:**
```json
{
  "product": {
    "_id": "product_id",
    // ... updated product object
  }
}
```

---

### DELETE /admin/products/:id

Delete a product.

**Response:**
```json
{
  "message": "Product deleted"
}
```

---

## Orders Endpoints

### GET /admin/orders

Get all orders.

**Query Parameters:**
- `status` (optional): Filter by status (pending, processing, shipped, delivered, cancelled)
- `paymentStatus` (optional): Filter by payment status (pending, paid, failed, refunded)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

**Response:**
```json
{
  "orders": [
    {
      "_id": "order_id",
      "orderNumber": "ORD-123456-0001",
      "user": {
        "_id": "user_id",
        "name": "Customer Name",
        "email": "customer@email.com"
      },
      "items": [
        {
          "product": {
            "_id": "product_id",
            "title": "Product Title",
            "coverImage": "/uploads/products/image.jpg"
          },
          "name": "Product Name",
          "price": 10000,
          "image": "/uploads/products/image.jpg",
          "selectedImageIndex": 0,
          "size": "A3",
          "material": "Matte Paper",
          "framing": "Black Frame",
          "quantity": 1
        }
      ],
      "shippingAddress": {
        "name": "Customer Name",
        "address": "Street Address",
        "city": "City",
        "state": "State",
        "zipCode": "123456",
        "country": "India",
        "phone": "+91 1234567890"
      },
      "subtotal": 10000,
      "discount": 1000,
      "total": 9000,
      "coupon": {
        "code": "DISCOUNT10",
        "discount": 1000
      },
      "status": "pending",
      "paymentStatus": "pending",
      "paymentMethod": "cod",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "pages": 2
  }
}
```

---

### GET /admin/orders/stats

Get order statistics.

**Query Parameters:**
- `startDate` (optional): Start date (ISO format)
- `endDate` (optional): End date (ISO format)

**Response:**
```json
{
  "stats": {
    "total": 100,
    "pending": 10,
    "processing": 15,
    "shipped": 20,
    "delivered": 50,
    "cancelled": 5,
    "totalRevenue": 1000000,
    "averageOrderValue": 10000
  }
}
```

---

### GET /admin/orders/:id

Get single order by ID.

**Response:**
```json
{
  "order": {
    "_id": "order_id",
    // ... same structure as list
  }
}
```

---

### PUT /admin/orders/:id/status

Update order status.

**Request Body:**
```json
{
  "status": "shipped",
  "paymentStatus": "paid",
  "trackingNumber": "TRK123456789"
}
```

**Status Options:**
- `pending`
- `processing`
- `shipped`
- `delivered`
- `cancelled`

**Payment Status Options:**
- `pending`
- `paid`
- `failed`
- `refunded`

**Response:**
```json
{
  "message": "Order status updated successfully",
  "order": {
    // ... updated order object
  }
}
```

---

## Customers Endpoints

### GET /admin/customers

Get all customers.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)
- `search` (optional): Search by name or email

**Response:**
```json
{
  "customers": [
    {
      "_id": "user_id",
      "name": "Customer Name",
      "email": "customer@email.com",
      "role": "user",
      "ordersCount": 5,
      "totalSpent": 50000,
      "lastOrder": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "pages": 2
  }
}
```

---

### GET /admin/customers/stats

Get customer statistics.

**Response:**
```json
{
  "stats": {
    "total": 100,
    "active": 80,
    "vip": 10,
    "totalRevenue": 1000000,
    "averageCustomerValue": 10000
  }
}
```

---

### GET /admin/customers/:id

Get single customer with order details.

**Response:**
```json
{
  "customer": {
    "_id": "user_id",
    "name": "Customer Name",
    "email": "customer@email.com",
    "role": "user",
    "orders": [
      {
        "_id": "order_id",
        "orderNumber": "ORD-123456-0001",
        "items": [
          {
            "product": {
              "_id": "product_id",
              "title": "Product Title",
              "coverImage": "/uploads/products/image.jpg",
              "price": 10000
            },
            "quantity": 1,
            "price": 10000
          }
        ],
        "total": 10000,
        "status": "delivered",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "ordersCount": 5,
    "totalSpent": 50000,
    "averageOrderValue": 10000,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Analytics Endpoints

### GET /admin/analytics/dashboard

Get dashboard statistics and analytics.

**Query Parameters:**
- `startDate` (optional): Start date (ISO format)
- `endDate` (optional): End date (ISO format)

**Response:**
```json
{
  "stats": {
    "revenue": {
      "total": 1000000,
      "averageOrder": 10000,
      "trend": [
        {
          "month": "Jan",
          "revenue": 150000,
          "orders": 15
        },
        {
          "month": "Feb",
          "revenue": 180000,
          "orders": 18
        }
      ]
    },
    "orders": {
      "total": 100,
      "breakdown": {
        "pending": 10,
        "processing": 15,
        "shipped": 20,
        "delivered": 50,
        "cancelled": 5
      }
    },
    "customers": {
      "total": 80,
      "active": 60
    },
    "products": {
      "total": 50,
      "published": 45
    },
    "coupons": {
      "total": 10,
      "active": 8
    },
    "topProducts": [
      {
        "id": "product_id",
        "title": "Product Title",
        "orders": 25,
        "image": "/uploads/products/image.jpg"
      }
    ]
  }
}
```

---

## Categories Endpoints

### GET /admin/categories

Get all categories.

**Response:**
```json
{
  "categories": [
    {
      "_id": "category_id",
      "name": "Category Name",
      "description": "Category description",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### GET /admin/categories/:id

Get single category.

**Response:**
```json
{
  "category": {
    "_id": "category_id",
    "name": "Category Name",
    // ... category object
  }
}
```

---

### POST /admin/categories

Create a new category.

**Request Body:**
```json
{
  "name": "Category Name",
  "description": "Category description"
}
```

**Response:**
```json
{
  "category": {
    "_id": "category_id",
    "name": "Category Name",
    // ... category object
  }
}
```

---

### PUT /admin/categories/:id

Update a category.

**Request Body:**
```json
{
  "name": "Updated Category Name",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "category": {
    "_id": "category_id",
    // ... updated category object
  }
}
```

---

### DELETE /admin/categories/:id

Delete a category.

**Response:**
```json
{
  "message": "Category deleted"
}
```

---

## SubCategories Endpoints

### GET /admin/subcategories

Get all subcategories (public endpoint, no auth required).

**Response:**
```json
{
  "subCategories": [
    {
      "_id": "subcategory_id",
      "name": "SubCategory Name",
      "category": {
        "_id": "category_id",
        "name": "Category Name"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### GET /admin/subcategories/:id

Get single subcategory (public endpoint, no auth required).

**Response:**
```json
{
  "subCategory": {
    "_id": "subcategory_id",
    // ... subcategory object
  }
}
```

---

### POST /admin/subcategories

Create a new subcategory.

**Request Body:**
```json
{
  "name": "SubCategory Name",
  "category": "category_id"
}
```

**Response:**
```json
{
  "subCategory": {
    "_id": "subcategory_id",
    // ... subcategory object
  }
}
```

---

### PUT /admin/subcategories/:id

Update a subcategory.

**Request Body:**
```json
{
  "name": "Updated SubCategory Name",
  "category": "category_id"
}
```

**Response:**
```json
{
  "subCategory": {
    "_id": "subcategory_id",
    // ... updated subcategory object
  }
}
```

---

### DELETE /admin/subcategories/:id

Delete a subcategory.

**Response:**
```json
{
  "message": "SubCategory deleted"
}
```

---

## Banners Endpoints

### GET /admin/banners

Get all banners.

**Response:**
```json
{
  "banners": [
    {
      "_id": "banner_id",
      "title": "Banner Title",
      "image": "/uploads/banners/image.jpg",
      "link": "https://example.com",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### GET /admin/banners/:id

Get single banner.

**Response:**
```json
{
  "banner": {
    "_id": "banner_id",
    // ... banner object
  }
}
```

---

### POST /admin/banners

Create a new banner.

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `title` (required): Banner title
- `image` (required): Image file
- `link` (optional): Banner link URL
- `isActive` (optional): Boolean (default: true)

**Response:**
```json
{
  "banner": {
    "_id": "banner_id",
    // ... banner object
  }
}
```

---

### PUT /admin/banners/:id

Update a banner.

**Content-Type:** `multipart/form-data`

**Form Fields:** Same as POST /admin/banners

**Response:**
```json
{
  "banner": {
    "_id": "banner_id",
    // ... updated banner object
  }
}
```

---

### DELETE /admin/banners/:id

Delete a banner.

**Response:**
```json
{
  "message": "Banner deleted"
}
```

---

## Testimonials Endpoints

### GET /admin/testimonials

Get all testimonials.

**Response:**
```json
{
  "testimonials": [
    {
      "_id": "testimonial_id",
      "name": "Customer Name",
      "review": "Great product!",
      "rating": 5,
      "image": "/uploads/testimonials/image.jpg",
      "backgroundImage": "/uploads/testimonials/bg.jpg",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### GET /admin/testimonials/:id

Get single testimonial.

**Response:**
```json
{
  "testimonial": {
    "_id": "testimonial_id",
    // ... testimonial object
  }
}
```

---

### POST /admin/testimonials

Create a new testimonial.

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `name` (required): Customer name
- `review` (required): Testimonial text
- `rating` (optional): Rating (1-5)
- `image` (optional): Customer image file
- `backgroundImage` (optional): Background image file
- `isActive` (optional): Boolean (default: true)

**Response:**
```json
{
  "testimonial": {
    "_id": "testimonial_id",
    // ... testimonial object
  }
}
```

---

### PUT /admin/testimonials/:id

Update a testimonial.

**Content-Type:** `multipart/form-data`

**Form Fields:** Same as POST /admin/testimonials

**Response:**
```json
{
  "testimonial": {
    "_id": "testimonial_id",
    // ... updated testimonial object
  }
}
```

---

### DELETE /admin/testimonials/:id

Delete a testimonial.

**Response:**
```json
{
  "message": "Testimonial deleted"
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "message": "Error message here"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Notes

1. **Image URLs**: All image paths returned by the API are relative paths. To access them, prepend the base URL:
   ```
   http://localhost:5000/uploads/products/image.jpg
   ```

2. **Authentication**: Store the token from login response and include it in all subsequent requests:
   ```
   Authorization: Bearer <token>
   ```

3. **File Uploads**: For endpoints that accept file uploads, use `multipart/form-data` content type.

4. **Pagination**: List endpoints support pagination via `page` and `limit` query parameters.

5. **Date Filtering**: Analytics and stats endpoints support date filtering via `startDate` and `endDate` query parameters (ISO 8601 format).

---

## Frontend Integration

The frontend admin panel is located at:
```
d:\devanSir\UI_Website\harshavardhan-adminpanel
```

API utility functions are available in:
```
src/utils/api.js
```

API base URL configuration:
```
src/config/api.js
```

---

## Testing

You can test the API using:
- Postman
- cURL
- The integrated admin panel frontend

**Example cURL for login:**
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@gmail.com","password":"demo123"}'
```

**Example cURL for getting products (with auth):**
```bash
curl -X GET http://localhost:5000/api/admin/products \
  -H "Authorization: Bearer <your_token_here>"
```

---

## Support

For issues or questions, refer to the main README.md or contact the development team.

