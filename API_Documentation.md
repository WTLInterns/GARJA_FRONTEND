# Garja Backend API Documentation

## Overview
The Garja Backend is a Spring Boot REST API for managing products, user authentication, and administrative functions. This documentation provides comprehensive details for all available endpoints, including request/response schemas, error codes, and ready-to-use cURL commands for Postman.

## Base Configuration
- **Base URL**: `http://localhost:8085`
- **Database**: MySQL (localhost:3306/garja)
- **Authentication**: JWT Bearer Token
- **Content-Type**: `application/json` (except file uploads)

## Global Error Codes

| HTTP Status | Error Code | Description | Response Format |
|-------------|------------|-------------|----------------|
| 200 | OK | Request successful | Response body varies by endpoint |
| 201 | Created | Resource created successfully | Response body with created resource |
| 400 | Bad Request | Invalid request data or custom exception | `"Error message string"` |
| 401 | Unauthorized | Invalid credentials or missing/invalid JWT | `null` or `"Unauthorized"` |
| 403 | Forbidden | Insufficient permissions | `"Forbidden"` |
| 404 | Not Found | Resource not found | `"Resource not found"` |
| 500 | Internal Server Error | Server-side error | `"Something went wrong"` |

---

# Authentication Endpoints

## 1. User Registration

**Endpoint**: `POST /auth/signup`  
**Description**: Register a new user or admin account  
**Authentication**: None required  

### Request Body
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe", 
  "phoneNumber": "+1234567890",
  "role": "USER"
}
```

### Request Schema
| Field | Type | Required | Description | Valid Values |
|-------|------|----------|-------------|--------------|
| email | String | Yes | User email address | Valid email format |
| password | String | Yes | User password | Any string |
| firstName | String | Yes | User's first name | Any string |
| lastName | String | Yes | User's last name | Any string |
| phoneNumber | String | Yes | Phone number | Any string |
| role | String | Yes | User role | "USER" or "ADMIN" |

### Success Response (201)
```json
{
  "id": 1,
  "email": "user@example.com",
  "password": "$2a$10$...", 
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "role": "USER",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Error Responses
| Status | Condition | Response Body |
|--------|-----------|---------------|
| 400 | Email already exists | `"Email already exists!"` |
| 400 | Invalid request data | `"Validation error message"` |
| 500 | Server error | `"Something went wrong"` |

### cURL Command
```bash
curl -X POST http://localhost:8085/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890", 
    "role": "USER"
  }'
```

---

## 2. User Login

**Endpoint**: `POST /auth/login`  
**Description**: Authenticate user and receive JWT token  
**Authentication**: None required  

### Request Body
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Request Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | String | Yes | User email address |
| password | String | Yes | User password |

### Success Response (200)
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "USER",
  "password": "$2a$10$..."
}
```

### Error Responses
| Status | Condition | Response Body |
|--------|-----------|---------------|
| 401 | Invalid credentials | `null` |
| 500 | Server error | Server error details |

### cURL Command
```bash
curl -X POST http://localhost:8085/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

---

# Password Management Endpoints

## 3. Reset Password

**Endpoint**: `POST /common/reset-password`  
**Description**: Reset user password (requires authentication)  
**Authentication**: JWT Bearer Token required  

### Request Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Request Body
```json
{
  "newPassword": "newPassword123"
}
```

### Request Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| newPassword | String | Yes | New password for the user |

### Success Response (200)
```json
{
  "email": "user@example.com",
  "message": "Password reset successfully!"
}
```

### Error Responses
| Status | Condition | Response Body |
|--------|-----------|---------------|
| 401 | Missing/invalid JWT | `"Unauthorized"` |
| 500 | User not found | `"User not found with email: user@example.com"` |

### cURL Command
```bash
curl -X POST http://localhost:8085/common/reset-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "newPassword": "newPassword123"
  }'
```

---

# Admin Product Management Endpoints

**Note**: All admin endpoints require JWT authentication with ADMIN role.

## 4. Add Product

**Endpoint**: `POST /admin/addProduct`  
**Description**: Add a new product with image upload  
**Authentication**: JWT Bearer Token (ADMIN role)  
**Content-Type**: `multipart/form-data`  

### Request Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data
```

### Form Data Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| productName | String | Yes | Product name |
| price | String | Yes | Product price |
| quantity | Integer | Yes | Available quantity |
| isActive | Boolean | No | Product active status |
| description | String | Yes | Product description |
| XS | String | No | XS size availability |
| M | String | No | M size availability |
| L | String | No | L size availability |
| XL | String | No | XL size availability |
| XXL | String | No | XXL size availability |
| image | File | No | Product image (max 10MB) |
| category | String | Yes | Product category |

### Success Response (200)
```json
{
  "id": 1,
  "message": "Product Added Successfully",
  "productName": "T-Shirt"
}
```

### Error Responses
| Status | Condition | Response Body |
|--------|-----------|---------------|
| 401 | Missing/invalid JWT | `"Unauthorized"` |
| 403 | Not admin role | `"Forbidden"` |
| 500 | Upload error | `"File upload error"` |

### cURL Command
```bash
curl -X POST http://localhost:8085/admin/addProduct \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "productName=T-Shirt" \
  -F "price=29.99" \
  -F "quantity=100" \
  -F "isActive=true" \
  -F "description=Comfortable cotton t-shirt" \
  -F "category=Apparel" \
  -F "image=@/path/to/image.jpg"
```

---

## 5. Update Product

**Endpoint**: `PUT /admin/updateProduct/{id}`  
**Description**: Update existing product by ID  
**Authentication**: JWT Bearer Token (ADMIN role)  
**Content-Type**: `multipart/form-data`  

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Integer | Yes | Product ID to update |

### Request Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data
```

### Form Data Fields
Same as Add Product endpoint.

### Success Response (200)
```json
{
  "id": 1,
  "productName": "Updated T-Shirt",
  "message": "Product updated successfully!"
}
```

### Error Responses
| Status | Condition | Response Body |
|--------|-----------|---------------|
| 401 | Missing/invalid JWT | `"Unauthorized"` |
| 403 | Not admin role | `"Forbidden"` |
| 404 | Product not found | `"Product not found with id 1"` |
| 500 | Update error | `"Update failed"` |

### cURL Command
```bash
curl -X PUT http://localhost:8085/admin/updateProduct/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "productName=Updated T-Shirt" \
  -F "price=34.99" \
  -F "quantity=150" \
  -F "isActive=true" \
  -F "description=Updated description" \
  -F "category=Apparel"
```

---

## 6. Delete Product

**Endpoint**: `DELETE /admin/deleteProduct/{id}`  
**Description**: Delete product by ID  
**Authentication**: JWT Bearer Token (ADMIN role)  

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Integer | Yes | Product ID to delete |

### Request Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Success Response (200)
```json
{
  "id": 1,
  "productName": "T-Shirt",
  "message": "Product deleted successfully!"
}
```

### Error Responses
| Status | Condition | Response Body |
|--------|-----------|---------------|
| 401 | Missing/invalid JWT | `"Unauthorized"` |
| 403 | Not admin role | `"Forbidden"` |
| 404 | Product not found | `{"id": 1, "productName": null, "message": "Product not found!"}` |

### cURL Command
```bash
curl -X DELETE http://localhost:8085/admin/deleteProduct/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 7. Get All Products

**Endpoint**: `GET /admin/getAllProducts`  
**Description**: Retrieve all products  
**Authentication**: JWT Bearer Token (ADMIN role)  

### Request Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Success Response (200)
```json
[
  {
    "id": 1,
    "productName": "T-Shirt",
    "price": "29.99",
    "quantity": 100,
    "active": true,
    "description": "Comfortable cotton t-shirt",
    "xs": "Available",
    "m": "Available", 
    "l": "Available",
    "xl": "Available",
    "xxl": "Out of Stock",
    "imageUrl": "https://res.cloudinary.com/...",
    "imagePublicId": "sample_image_id",
    "category": "Apparel",
    "date": "11/09/2025",
    "time": "07:32:37",
    "reviews": []
  }
]
```

### Error Responses
| Status | Condition | Response Body |
|--------|-----------|---------------|
| 401 | Missing/invalid JWT | `"Unauthorized"` |
| 403 | Not admin role | `"Forbidden"` |

### cURL Command
```bash
curl -X GET http://localhost:8085/admin/getAllProducts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 8. Get Products by Category

**Endpoint**: `GET /admin/getProductByCategory`  
**Description**: Retrieve products filtered by category  
**Authentication**: JWT Bearer Token (ADMIN role)  

### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| category | String | Yes | Category name to filter |

### Request Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Success Response (200)
```json
[
  {
    "id": 1,
    "productName": "T-Shirt",
    "price": "29.99",
    "quantity": 100,
    "active": true,
    "description": "Comfortable cotton t-shirt",
    "xs": "Available",
    "m": "Available",
    "l": "Available", 
    "xl": "Available",
    "xxl": "Out of Stock",
    "imageUrl": "https://res.cloudinary.com/...",
    "imagePublicId": "sample_image_id",
    "category": "Apparel",
    "date": "11/09/2025",
    "time": "07:32:37",
    "reviews": []
  }
]
```

### Error Responses
| Status | Condition | Response Body |
|--------|-----------|---------------|
| 401 | Missing/invalid JWT | `"Unauthorized"` |
| 403 | Not admin role | `"Forbidden"` |
| 400 | Missing category param | `"Bad Request"` |

### cURL Command
```bash
curl -X GET "http://localhost:8085/admin/getProductByCategory?category=Apparel" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 9. Get Latest Products

**Endpoint**: `GET /admin/getLatestProducts`  
**Description**: Retrieve top 4 latest products ordered by date and time  
**Authentication**: JWT Bearer Token (ADMIN role)  

### Request Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Success Response (200)
```json
[
  {
    "id": 4,
    "productName": "Latest Product",
    "price": "49.99",
    "quantity": 50,
    "active": true,
    "description": "Newest product added",
    "xs": "Available",
    "m": "Available",
    "l": "Available",
    "xl": "Available", 
    "xxl": "Available",
    "imageUrl": "https://res.cloudinary.com/...",
    "imagePublicId": "latest_image_id",
    "category": "New",
    "date": "11/09/2025",
    "time": "07:32:37",
    "reviews": []
  }
]
```

### Error Responses
| Status | Condition | Response Body |
|--------|-----------|---------------|
| 401 | Missing/invalid JWT | `"Unauthorized"` |
| 403 | Not admin role | `"Forbidden"` |

### cURL Command
```bash
curl -X GET http://localhost:8085/admin/getLatestProducts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

# Postman Collection

## Environment Variables
Create these environment variables in Postman:

```json
{
  "baseUrl": "http://localhost:8085",
  "jwtToken": "{{AUTH_TOKEN}}"
}
```

## Collection Structure
```
Garja Backend API
├── Authentication
│   ├── Register User
│   ├── Register Admin  
│   └── Login
├── Password Management
│   └── Reset Password
└── Admin Product Management
    ├── Add Product
    ├── Update Product
    ├── Delete Product
    ├── Get All Products
    ├── Get Products by Category
    └── Get Latest Products
```

## Pre-request Scripts

For authenticated endpoints, add this pre-request script:

```javascript
// Set authorization header
pm.request.headers.add({
  key: 'Authorization',
  value: 'Bearer ' + pm.environment.get('jwtToken')
});
```

## Test Scripts

Add this test script to login endpoint to save JWT token:

```javascript
if (pm.response.code === 200) {
  const response = pm.response.json();
  if (response.token) {
    pm.environment.set('jwtToken', response.token);
    console.log('JWT Token saved:', response.token);
  }
}
```

---

# Error Code Reference

## Custom Exceptions

| Exception | HTTP Status | Trigger Condition | Message Format |
|-----------|-------------|-------------------|----------------|
| CustomException | 400 | Email already exists during signup | `"Email already exists!"` |
| CustomException | 400 | Product not found by ID | `"Product not found with that Id{id}"` |
| RuntimeException | 500 | User not found during password reset | `"User not found with email: {email}"` |
| RuntimeException | 500 | Product not found during update | `"Product not found with id {id}"` |

## HTTP Status Codes Used

| Status Code | Usage | Description |
|-------------|-------|-------------|
| 200 | Successful GET/PUT requests | Request processed successfully |
| 201 | Successful POST (signup) | Resource created successfully |
| 400 | Bad Request | Invalid input or custom exception |
| 401 | Unauthorized | Invalid credentials or missing JWT |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Unexpected server error |

## Authentication Flow

1. **Registration**: `POST /auth/signup` → Returns JWT token
2. **Login**: `POST /auth/login` → Returns JWT token
3. **Authenticated Requests**: Include `Authorization: Bearer {token}` header
4. **Token Expiration**: Implement token refresh or re-login

## Security Notes

- All admin endpoints require ADMIN role in JWT
- JWT tokens are required for password reset and all admin functions  
- File uploads are limited to 10MB
- Passwords are encrypted using BCrypt
- CORS is configured for cross-origin requests

---

*Documentation generated for Garja Backend v1.0*  
*Last updated: September 11, 2025*
