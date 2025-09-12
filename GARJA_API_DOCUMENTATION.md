# GARJA E-Commerce API Documentation

## Overview
The GARJA API is a RESTful e-commerce backend built with Spring Boot that provides comprehensive functionality for user authentication, product management, shopping cart operations, order processing, and wishlist management.

**Base URL:** `http://localhost:8085`
**Version:** 1.0.0
**Authentication:** Bearer JWT Token

## Quick Start

1. **Register a User:** `POST /auth/signup`
2. **Login:** `POST /auth/login` 
3. **Browse Products:** `GET /public/getAllProducts`
4. **Add to Cart:** `POST /user/cart/add/{productId}`
5. **Checkout:** `POST /user/orders/checkout`

## Authentication

### Overview
The API uses JWT (JSON Web Token) based authentication. After successful login, include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### 1. User Registration
**POST** `/auth/signup`

Register a new user account.

**Security:** None (Public endpoint)

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "1234567890",
  "role": "USER"
}
```

**Responses:**

**201 Created:**
```json
{
  "id": 1,
  "email": "john.doe@example.com",
  "password": "$2a$10$hashedPassword...",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "1234567890",
  "role": "USER",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**400 Bad Request:**
```json
"Email already exists"
```

**500 Internal Server Error:**
```json
"Something went wrong"
```

### 2. User Login
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Security:** None (Public endpoint)

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Responses:**

**200 OK:**
```json
{
  "id": 1,
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "USER",
  "password": "$2a$10$hashedPassword..."
}
```

**401 Unauthorized:** No response body

---

## Public Endpoints

These endpoints are accessible without authentication.

### 1. Get All Products
**GET** `/public/getAllProducts`

Retrieve all available products.

**Security:** None

**Response:**
```json
[
  {
    "id": 1,
    "productName": "Cotton T-Shirt",
    "price": "29.99",
    "quantity": 100,
    "isActive": "true",
    "description": "Premium cotton t-shirt",
    "XS": "10",
    "M": "25",
    "L": "30",
    "XL": "25",
    "XXL": "10",
    "imageUrl": "https://cloudinary.com/image.jpg",
    "imagePublicId": "garja/product_123",
    "category": "clothing",
    "date": "2024-01-15",
    "time": "10:30:00",
    "reviews": []
  }
]
```

### 2. Get Products by Category
**GET** `/public/getProductByCategory`

Filter products by category.

**Query Parameters:**
- `category` (required): Category name (e.g., "clothing", "electronics")

**Example:** `/public/getProductByCategory?category=clothing`

**Response:** Same as Get All Products (filtered by category)

### 3. Get Latest Products
**GET** `/public/getLatestProducts`

Retrieve recently added products.

**Response:** Same as Get All Products (sorted by latest)

### 4. Get Product by ID
**GET** `/public/getProductById/{id}`

Retrieve specific product details.

**Path Parameters:**
- `id` (required): Product ID

**Example:** `/public/getProductById/1`

**Response:** Single product object (same structure as above)

---

## Admin Endpoints

**Security:** Requires `ADMIN` role and valid JWT token.

### 1. Add Product
**POST** `/admin/addProduct`

Create a new product.

**Content-Type:** `multipart/form-data`

**Form Parameters:**
```
productName: "New T-Shirt"
price: "39.99"
quantity: 50
isActive: "true"
description: "Brand new cotton t-shirt"
XS: "5"
M: "15"
L: "20"
XL: "8"
XXL: "2"
image: [file upload]
date: "2024-01-15"
time: "10:30:00"
category: "clothing"
```

**Response:**
```json
{
  "id": 2,
  "productName": "New T-Shirt",
  "message": "Product added successfully"
}
```

### 2. Update Product
**PUT** `/admin/updateProduct/{id}`

Update existing product.

**Path Parameters:**
- `id` (required): Product ID to update

**Content-Type:** `multipart/form-data`

**Form Parameters:** Same as Add Product

**Response:** Same as Add Product with "Product updated successfully" message

### 3. Delete Product
**DELETE** `/admin/deleteProduct/{id}`

Remove a product.

**Path Parameters:**
- `id` (required): Product ID to delete

**Response:**
```json
{
  "id": 1,
  "productName": "Deleted Product",
  "message": "Product deleted successfully"
}
```

### 4. Get All Orders (Admin)
**GET** `/admin/orders`

Retrieve all orders for admin management.

**Response:**
```json
[
  {
    "id": 1,
    "orderDate": "2024-01-15T10:30:00",
    "totalAmount": 59.98,
    "status": "CONFIRMED",
    "productName": "Cotton T-Shirt",
    "quantity": 2,
    "size": "L",
    "image": "https://cloudinary.com/image.jpg",
    "userId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "1234567890"
  }
]
```

### 5. Update Order Status
**PUT** `/admin/update-status/{orderId}`

Update order status.

**Path Parameters:**
- `orderId` (required): Order ID

**Query Parameters:**
- `newStatus` (required): New order status

**Example:** `/admin/update-status/1?newStatus=SHIPPED`

**Response:** Updated order object

### 6. Get Order by ID (Admin)
**GET** `/admin/order/{orderId}`

Get specific order details for admin.

**Path Parameters:**
- `orderId` (required): Order ID

**Response:** Single admin order response object

### 7. Get User Role Statistics
**GET** `/admin/role-stats`

Get statistics about users and their orders.

**Response:**
```json
[
  {
    "userId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "USER",
    "totalOrders": 5,
    "totalSpent": 299.95
  }
]
```

---

# GARJA E-Commerce API Documentation

## Base URL
`http://localhost:8085`

## Authentication
All user endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Cart Management

**Security:** Requires `USER` role and valid JWT token.

### 1. Add Product to Cart
**POST** `/user/cart/add/{productId}`

Add a product to user's shopping cart.

**Path Parameters:**
- `productId` (required): Product ID

**Query Parameters:**
- `quantity` (optional, default: 1): Quantity to add

**Example:** `/user/cart/add/1?quantity=2`

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "items": [
    {
      "id": 1,
      "quantity": 2,
      "lineTotal": 59.98,
      "size": "M",
      "productId": 1,
      "productName": "Cotton T-Shirt",
      "price": "29.99",
      "imageUrl": "https://cloudinary.com/image.jpg",
      "category": "clothing",
      "isActive": "true"
    }
  ],
  "totalAmount": 59.98,
  "totalItems": 2
}
```

### 2. Get Cart
**GET** `/user/cart`

Retrieve user's current cart.

**Response:** Same as Add Product to Cart response

### 3. Remove Product from Cart
**DELETE** `/user/cart/remove/{productId}`

Remove a product from cart.

**Path Parameters:**
- `productId` (required): Product ID to remove

**Response:** Updated cart response

### 4. Update Product Quantity
**PUT** `/user/cart/update/{productId}`

Update quantity of product in cart.

**Path Parameters:**
- `productId` (required): Product ID

**Query Parameters:**
- `quantity` (required): New quantity

**Example:** `/user/cart/update/1?quantity=3`

**Response:** Updated cart response

### 5. Update Product Size
**PUT** `/user/cart/size/{productId}`

Update size of product in cart.

**Path Parameters:**
- `productId` (required): Product ID

**Query Parameters:**
- `size` (required): New size (XS, M, L, XL, XXL)

**Example:** `/user/cart/size/1?size=L`

**Response:** Updated cart response

### 6. Clear Cart
**DELETE** `/user/cart/clear`

Remove all items from cart.

**Response:**
```json
"Cart cleared successfully"
```

**Error Response:**
```json
"Failed to clear cart"
```

---

## Order Management

**Security:** Requires `USER` role and valid JWT token.

### 1. Buy Now
**POST** `/user/orders/buy-now`

Purchase product immediately without adding to cart.

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 2,
  "size": "L"
}
```

**Response:**
```json
{
  "id": 1,
  "orderDate": "2024-01-15T10:30:00",
  "totalAmount": 59.98,
  "status": "CONFIRMED",
  "productName": "Cotton T-Shirt",
  "quantity": 2,
  "size": "L",
  "image": "https://cloudinary.com/image.jpg",
  "userId": 1,
  "message": "Order placed successfully"
}
```

### 2. Checkout Cart
**POST** `/user/orders/checkout`

Create order from current cart items.

**Response:** Same as Buy Now response

### 3. Get Order History
**GET** `/user/orders/history`

Retrieve user's purchase history.

**Response:**
```json
[
  {
    "id": 1,
    "orderDate": "2024-01-15T10:30:00",
    "totalAmount": 59.98,
    "status": "CONFIRMED",
    "productName": "Cotton T-Shirt",
    "quantity": 2,
    "size": "L",
    "image": "https://cloudinary.com/image.jpg",
    "userId": 1,
    "message": null
  }
]
```

---

## Wishlist Management

**Security:** Requires `USER` role and valid JWT token.

### 1. Add to Wishlist
**POST** `/user/wishlist/{userId}/{productId}`

Add product to user's wishlist.

**Path Parameters:**
- `userId` (required): User ID
- `productId` (required): Product ID

**Response:** Success message string

### 2. Remove Product from Wishlist
**DELETE** `/user/wishlist/{userId}/{productId}`

Remove specific product from wishlist.

**Path Parameters:**
- `userId` (required): User ID
- `productId` (required): Product ID

**Response:** Success message string

### 3. Remove from Wishlist
**DELETE** `/user/wishlist/{wishlistId}`

Remove wishlist item by wishlist ID.

**Path Parameters:**
- `wishlistId` (required): Wishlist item ID

**Response:** Success message string

### 4. Get User Wishlist
**GET** `/user/wishlist/user/{userId}`

Retrieve user's wishlist.

**Path Parameters:**
- `userId` (required): User ID

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "productId": 1,
    "productName": "Cotton T-Shirt",
    "price": "29.99",
    "imageUrl": "https://cloudinary.com/image.jpg",
    "category": "clothing",
    "dateAdded": "2024-01-15T10:30:00"
  }
]
```

---


## Error Handling

### Common HTTP Status Codes

- **200 OK:** Request successful
- **201 Created:** Resource created successfully
- **400 Bad Request:** Invalid request data or business logic error
- **401 Unauthorized:** Authentication required or invalid credentials
- **403 Forbidden:** Insufficient permissions
- **404 Not Found:** Resource not found
- **500 Internal Server Error:** Server error

### Error Response Format

Most endpoints return string error messages for 400/500 status codes:

```json
"Error message describing the issue"
```

### Authentication Errors

**Missing/Invalid Token:**
- Status: 401 Unauthorized
- Response: No body or authentication challenge

**Insufficient Permissions:**
- Status: 403 Forbidden
- Response: Access denied message

---

## Security Configuration

### Endpoint Security Matrix

| Endpoint Pattern | Required Role | Authentication |
|-----------------|---------------|----------------|
| `/auth/**` | None | None |
| `/public/**` | None | None |
| `/admin/**` | ADMIN | JWT Required |
| `/user/**` | USER | JWT Required |
| `/common/reset-password` | USER or ADMIN | JWT Required |

### JWT Token Structure

```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "sub": "user@example.com",
  "role": "USER",
  "iat": timestamp,
  "exp": timestamp
}
```

### CORS Configuration

The API supports Cross-Origin Resource Sharing (CORS) for web applications.

---

## Models/DTOs

### User Model
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "1234567890",
  "role": "USER",
  "password": "hashed_password"
}
```

### Product Model
```json
{
  "id": 1,
  "productName": "Product Name",
  "price": "29.99",
  "quantity": 100,
  "isActive": "true",
  "description": "Product description",
  "XS": "10",
  "M": "25", 
  "L": "30",
  "XL": "25",
  "XXL": "10",
  "imageUrl": "https://cloudinary.com/image.jpg",
  "imagePublicId": "garja/product_123",
  "category": "clothing",
  "date": "2024-01-15",
  "time": "10:30:00",
  "reviews": []
}
```

### Order Model
```json
{
  "id": 1,
  "orderDate": "2024-01-15T10:30:00",
  "totalAmount": 59.98,
  "status": "CONFIRMED",
  "productName": "Product Name",
  "quantity": 2,
  "size": "L",
  "image": "https://cloudinary.com/image.jpg",
  "userId": 1
}
```

---

## Environment Configuration

### Application Properties
- **Server Port:** 8085
- **Database:** MySQL (localhost:3306/garja)
- **File Upload:** Max 10MB
- **Cloud Storage:** Cloudinary integration

### Database Setup
```sql
CREATE DATABASE garja;
-- Tables are auto-created via JPA/Hibernate
```

---

## Testing the API

### Using cURL

**Register User:**
```bash
curl -X POST http://localhost:8085/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "phoneNumber": "1234567890",
    "role": "USER"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8085/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Get Products:**
```bash
curl -X GET http://localhost:8085/public/getAllProducts
```

**Add to Cart (with token):**
```bash
curl -X POST "http://localhost:8085/user/cart/add/1?quantity=2" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Postman Collection

Import the included `openapi.yaml` into Postman for a complete API collection.

---

## Support

For API support and questions, contact:
- **Email:** support@garja.com
- **Documentation Version:** 1.0.0
- **Last Updated:** January 2024

---

**Note:** This documentation covers all currently implemented and working endpoints in the GARJA backend. Some endpoints mentioned in the OpenAPI specification may not be fully implemented yet.
