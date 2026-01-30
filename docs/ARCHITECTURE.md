# Architecture Guide

## Overview

This boilerplate follows clean architecture principles with clear separation of concerns and modular design.

## Core Principles

1. **Separation of Concerns** - Each layer has a specific responsibility
2. **Dependency Inversion** - High-level modules don't depend on low-level modules
3. **Single Responsibility** - Each module/class has one reason to change
4. **DRY (Don't Repeat Yourself)** - Reusable utilities and middleware

## Project Structure

### Configuration Layer (`config/`)

Handles environment configuration, database connections, and logging setup.

- `env.js` - Environment variable parsing and validation
- `database.js` - Database connection management
- `logger.js` - Logging configuration

### Module Layer (`modules/`)

Each feature is a self-contained module with its own:

- `*.routes.js` - Route definitions
- `*.controller.js` - Request/response handling
- `*.service.js` - Business logic
- `*.schema.js` - Input validation schemas
- `*.model.js` - Database models

**Example Module Structure:**

```
modules/
└── feature/
    ├── feature.routes.js     # Route definitions
    ├── feature.controller.js # HTTP handlers
    ├── feature.service.js    # Business logic
    ├── feature.schema.js     # Validation schemas
    └── feature.model.js      # Data models
```

### Middleware Layer (`middlewares/`)

Reusable middleware for cross-cutting concerns:

- `auth.middleware.js` - JWT authentication
- `rbac.middleware.js` - Role-based access control
- `validate.middleware.js` - Request validation
- `error.middleware.js` - Error handling
- `rate-limit.middleware.js` - Rate limiting

### Utility Layer (`utils/`)

Shared utilities and helpers:

- `jwt.js` - Token generation and verification
- `response.js` - Standardized API responses
- `constants.js` - Application constants
- `sanitize.js` - Data sanitization

## Request Flow

```
Request
  ↓
Rate Limiting Middleware
  ↓
Routes (routes.js)
  ↓
Module Route (*.routes.js)
  ↓
Validation Middleware (validate.middleware.js)
  ↓
Authentication Middleware (auth.middleware.js)
  ↓
Authorization Middleware (rbac.middleware.js)
  ↓
Controller (*.controller.js)
  ↓
Service (*.service.js)
  ↓
Model (*.model.js)
  ↓
Database
  ↓
Response / Error
```

## Adding a New Module

### 1. Create Module Directory

```bash
mkdir -p src/modules/product
```

### 2. Create Model

```javascript
// src/modules/product/product.model.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    // ... other fields
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
```

### 3. Create Validation Schemas

```javascript
// src/modules/product/product.schema.js
const { z } = require('zod');

const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    price: z.number().positive(),
  }),
});

module.exports = { createProductSchema };
```

### 4. Create Service

```javascript
// src/modules/product/product.service.js
const Product = require('./product.model');

class ProductService {
  async createProduct(data) {
    return await Product.create(data);
  }

  async getAllProducts() {
    return await Product.find();
  }
}

module.exports = new ProductService();
```

### 5. Create Controller

```javascript
// src/modules/product/product.controller.js
const productService = require('./product.service');
const { success, HTTP_STATUS } = require('../../utils/response');

class ProductController {
  async create(req, res, next) {
    try {
      const product = await productService.createProduct(req.validated.body);
      success(res, HTTP_STATUS.CREATED, 'Product created', { product });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProductController();
```

### 6. Create Routes

```javascript
// src/modules/product/product.routes.js
const express = require('express');
const controller = require('./product.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { validate } = require('../../middlewares/validate.middleware');
const { createProductSchema } = require('./product.schema');

const router = express.Router();

router.post('/', authenticate, validate(createProductSchema), controller.create);

module.exports = router;
```

### 7. Register Routes

```javascript
// src/routes.js
const productRoutes = require('./modules/product/product.routes');

const routes = [
  // ... existing routes
  {
    path: '/products',
    route: productRoutes,
  },
];
```

## Best Practices

### Controllers

- Keep thin - only handle HTTP concerns
- Extract business logic to services
- Use try-catch for error handling
- Always call `next(err)` on errors

### Services

- Contain all business logic
- Throw errors with proper status codes
- Return sanitized data
- Keep database transactions here

### Models

- Define schema validation
- Add instance methods when needed
- Use pre/post hooks for data transformation
- Keep models focused on data structure

### Validation

- Validate all inputs
- Use Zod for schema definition
- Validate at route level, not in controllers
- Provide clear error messages

### Error Handling

- Use custom error classes
- Provide meaningful error messages
- Log errors appropriately
- Never expose sensitive data in errors

## Security Considerations

1. **Authentication** - All protected routes require JWT
2. **Authorization** - RBAC middleware for role-specific access
3. **Input Validation** - Validate all user inputs
4. **Sanitization** - Remove malicious data
5. **Rate Limiting** - Prevent abuse
6. **Security Headers** - Helmet middleware
7. **CORS** - Configured origins only

## Testing Strategy

1. **Unit Tests** - Test services and utilities
2. **Integration Tests** - Test API endpoints
3. **Coverage** - Maintain >70% coverage
4. **Mocking** - Use in-memory database for tests

## Performance Optimization

1. **Database Indexing** - Add indexes to frequently queried fields
2. **Caching** - Implement Redis for frequently accessed data
3. **Pagination** - Always paginate list endpoints
4. **Compression** - Enable gzip compression
5. **Connection Pooling** - MongoDB connection pooling enabled
