# Complete API Documentation
## RUMI by Manisha - E-commerce Platform

---

## 📡 API Base URL

```
http://localhost/rumi-backend/api
```

---

## 🔐 Authentication

Currently, all endpoints are open. For production, implement JWT authentication:
- Add `Authorization: Bearer {token}` header
- Protect admin endpoints (POST, PUT, DELETE)

---

## 📋 API Endpoints Overview

### **1. FAQs API** (`/api/faqs.php`)
### **2. Products API** (`/api/products.php`)
### **3. Categories API** (`/api/categories.php`)
### **4. Gallery API** (`/api/gallery.php`)

---

## 1️⃣ FAQs API

### **GET - Get All FAQs**
```
GET /api/faqs.php
GET /api/faqs.php?page=1&limit=20
GET /api/faqs.php?status=active
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "question": "How long does shipping take?",
      "answer": "Domestic orders take 5-7 business days...",
      "category": "Orders & Shipping",
      "popular": true,
      "display_order": 1,
      "status": "active",
      "created_at": "2024-01-15 10:00:00",
      "updated_at": "2024-01-15 10:00:00"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

### **GET - Get Single FAQ**
```
GET /api/faqs.php?id=1
```

### **GET - Get by Category**
```
GET /api/faqs.php?category=Orders & Shipping
```

### **GET - Get Popular FAQs**
```
GET /api/faqs.php?popular=1&limit=5
```

### **GET - Search FAQs**
```
GET /api/faqs.php?search=shipping
```

### **GET - Get Grouped FAQs**
```
GET /api/faqs.php?grouped=1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "Orders & Shipping": [...],
    "Returns & Exchanges": [...],
    "Products & Care": [...]
  }
}
```

### **GET - Get Statistics**
```
GET /api/faqs.php?stats=1
```

### **POST - Create FAQ**
```
POST /api/faqs.php
Content-Type: application/json

{
  "question": "How do I track my order?",
  "answer": "You can track your order by...",
  "category": "Orders & Shipping",
  "popular": true,
  "status": "active"
}
```

### **PUT - Update FAQ**
```
PUT /api/faqs.php?id=1
Content-Type: application/json

{
  "question": "Updated question",
  "popular": false
}
```

### **DELETE - Delete FAQ**
```
DELETE /api/faqs.php?id=1
```

---

## 2️⃣ Products API

### **GET - Get All Products**
```
GET /api/products.php
GET /api/products.php?page=1&limit=20
GET /api/products.php?category=1
GET /api/products.php?status=active
GET /api/products.php?min_price=1000&max_price=5000
GET /api/products.php?q=saree
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Banarasi Silk Saree",
      "slug": "banarasi-silk-saree",
      "description": "Beautiful handwoven saree...",
      "category_id": 1,
      "category_name": "Sarees",
      "price": 4500.00,
      "compare_price": 6000.00,
      "stock_quantity": 10,
      "featured": true,
      "primary_image": "https://...",
      "avg_rating": 4.5,
      "review_count": 12,
      "status": "active"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### **GET - Get Single Product**
```
GET /api/products.php?id=1
GET /api/products.php?slug=banarasi-silk-saree
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Banarasi Silk Saree",
    "slug": "banarasi-silk-saree",
    "description": "...",
    "price": 4500.00,
    "images": [
      {
        "id": 1,
        "image_url": "https://...",
        "alt_text": "Front view",
        "is_primary": true
      }
    ],
    "variants": [
      {
        "id": 1,
        "variant_name": "Color",
        "variant_value": "Red",
        "price_adjustment": 0,
        "stock_quantity": 5
      }
    ]
  }
}
```

### **GET - Get Featured Products**
```
GET /api/products.php?featured=1&limit=8
```

### **GET - Get New Arrivals**
```
GET /api/products.php?new=1&limit=8
```

### **GET - Get Best Sellers**
```
GET /api/products.php?bestseller=1&limit=8
```

### **GET - Search Products**
```
GET /api/products.php?search=silk saree
```

### **GET - Get Related Products**
```
GET /api/products.php?related=1&category=1&limit=4
```

### **GET - Get Statistics**
```
GET /api/products.php?stats=1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "active": 140,
    "draft": 10,
    "featured": 20,
    "new_arrivals": 15,
    "best_sellers": 25,
    "low_stock": 8,
    "out_of_stock": 3
  }
}
```

### **POST - Create Product**
```
POST /api/products.php
Content-Type: application/json

{
  "name": "Silk Saree",
  "slug": "silk-saree",
  "description": "Beautiful silk saree",
  "category_id": 1,
  "price": 4500,
  "compare_price": 6000,
  "sku": "SAREE-001",
  "stock_quantity": 10,
  "featured": true,
  "status": "active",
  "images": [
    {
      "url": "https://...",
      "alt": "Front view"
    }
  ]
}
```

### **PUT - Update Product**
```
PUT /api/products.php?id=1
Content-Type: application/json

{
  "price": 4200,
  "stock_quantity": 15,
  "featured": false
}
```

### **DELETE - Delete Product**
```
DELETE /api/products.php?id=1
```

---

## 3️⃣ Categories API

### **GET - Get All Categories**
```
GET /api/categories.php
GET /api/categories.php?status=active
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Sarees",
      "slug": "sarees",
      "description": "Traditional sarees",
      "image_url": "https://...",
      "parent_id": null,
      "display_order": 1,
      "status": "active",
      "product_count": 45
    }
  ]
}
```

### **GET - Get Single Category**
```
GET /api/categories.php?id=1
GET /api/categories.php?slug=sarees
```

### **GET - Get Category Tree**
```
GET /api/categories.php?tree=1
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Sarees",
      "slug": "sarees",
      "children": [
        {
          "id": 6,
          "name": "Silk Sarees",
          "slug": "silk-sarees",
          "parent_id": 1
        }
      ]
    }
  ]
}
```

### **POST - Create Category**
```
POST /api/categories.php
Content-Type: application/json

{
  "name": "Silk Sarees",
  "slug": "silk-sarees",
  "description": "Premium silk sarees",
  "parent_id": 1,
  "status": "active"
}
```

### **PUT - Update Category**
```
PUT /api/categories.php?id=1
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description"
}
```

### **DELETE - Delete Category**
```
DELETE /api/categories.php?id=1
```

---

## 4️⃣ Gallery API

### **GET - Get All Gallery Items**
```
GET /api/gallery.php
GET /api/gallery.php?page=1&limit=20
GET /api/gallery.php?status=active
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "url": "https://...",
      "title": "Traditional Elegance",
      "category": "Sarees",
      "type": "instagram-post",
      "thumbnail": null,
      "instagram_url": "https://instagram.com/p/...",
      "status": "active",
      "display_order": 1,
      "created_at": "2024-01-15 10:00:00"
    }
  ]
}
```

### **GET - Get Single Item**
```
GET /api/gallery.php?id=1
```

### **GET - Get by Category**
```
GET /api/gallery.php?category=Sarees
```

### **GET - Get by Type**
```
GET /api/gallery.php?type=instagram-post
```

**Types:** `image`, `video`, `instagram-post`, `instagram-reel`

### **GET - Get Grouped by Category**
```
GET /api/gallery.php?grouped=1
```

### **GET - Get Statistics**
```
GET /api/gallery.php?stats=1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 145,
    "active": 132,
    "draft": 13,
    "images": 89,
    "videos": 12,
    "instagram_posts": 24,
    "instagram_reels": 20
  }
}
```

### **POST - Create Gallery Item**
```
POST /api/gallery.php
Content-Type: application/json

{
  "url": "https://...",
  "title": "Beautiful Saree",
  "category": "Sarees",
  "type": "instagram-post",
  "instagram_url": "https://instagram.com/p/...",
  "status": "active"
}
```

### **PUT - Update Gallery Item**
```
PUT /api/gallery.php?id=1
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "draft"
}
```

### **DELETE - Delete Gallery Item**
```
DELETE /api/gallery.php?id=1
```

---

## 📊 Response Format

### **Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### **Error Response:**
```json
{
  "error": "Error message description"
}
```

### **HTTP Status Codes:**
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `405` - Method Not Allowed
- `500` - Internal Server Error

---

## 🔧 Common Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number (default: 1) |
| `limit` | integer | Items per page (default: 20) |
| `status` | string | Filter by status (active, draft, archived) |
| `search` | string | Search query |
| `q` | string | Search query (alias) |

---

## 💡 Usage Examples

### **JavaScript/TypeScript (Fetch API):**

```typescript
// Get all FAQs
const response = await fetch('http://localhost/rumi-backend/api/faqs.php?grouped=1');
const data = await response.json();

if (data.success) {
  console.log(data.data);
}

// Create FAQ
const response = await fetch('http://localhost/rumi-backend/api/faqs.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    question: 'New question',
    answer: 'New answer',
    category: 'Orders & Shipping',
    status: 'active'
  })
});

// Update FAQ
const response = await fetch('http://localhost/rumi-backend/api/faqs.php?id=1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    popular: true
  })
});

// Delete FAQ
const response = await fetch('http://localhost/rumi-backend/api/faqs.php?id=1', {
  method: 'DELETE'
});
```

### **React Hook Example:**

```typescript
import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost/rumi-backend/api';

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams(filters);
        const response = await fetch(`${API_BASE}/products.php?${params}`);
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  return { products, loading, error };
};
```

---

## 🔒 Security Best Practices

1. **Input Validation** - Always validate and sanitize inputs
2. **SQL Injection** - Use PDO prepared statements (already implemented)
3. **XSS Protection** - Sanitize output data
4. **Authentication** - Implement JWT for admin endpoints
5. **Rate Limiting** - Add rate limiting for API calls
6. **HTTPS** - Use HTTPS in production
7. **CORS** - Configure proper CORS policies

---

## 📝 Notes

- All timestamps are in `YYYY-MM-DD HH:MM:SS` format
- All prices are in decimal format (10,2)
- Boolean values: `true` (1) or `false` (0)
- Pagination starts at page 1
- Default limit is 20 items per page

---

**Last Updated:** January 23, 2026  
**Version:** 1.0  
**Status:** Production Ready
