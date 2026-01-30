# API Examples

Collection of cURL examples for testing the API.

## Authentication

### Register User

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }'
```

**Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

### Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### Refresh Token

```bash
curl -X POST http://localhost:5000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

### Logout

```bash
curl -X POST http://localhost:5000/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## User Management

### Get Current User Profile

```bash
curl -X GET http://localhost:5000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

### Get All Users (Admin Only)

```bash
curl -X GET http://localhost:5000/api/v1/users \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"
```

### Get User by ID (Admin Only)

```bash
curl -X GET http://localhost:5000/api/v1/users/USER_ID \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"
```

### Update User (Admin Only)

```bash
curl -X PATCH http://localhost:5000/api/v1/users/USER_ID \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com"
  }'
```

### Delete User (Admin Only)

```bash
curl -X DELETE http://localhost:5000/api/v1/users/USER_ID \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"
```

## Error Responses

### Validation Error (422)

```json
{
  "success": false,
  "statusCode": 422,
  "message": "Validation failed"
}
```

### Unauthorized (401)

```json
{
  "success": false,
  "statusCode": 401,
  "message": "No token provided"
}
```

### Forbidden (403)

```json
{
  "success": false,
  "statusCode": 403,
  "message": "You do not have permission to perform this action"
}
```

### Not Found (404)

```json
{
  "success": false,
  "statusCode": 404,
  "message": "User not found"
}
```

### Conflict (409)

```json
{
  "success": false,
  "statusCode": 409,
  "message": "Email already registered"
}
```

### Internal Server Error (500)

```json
{
  "success": false,
  "statusCode": 500,
  "message": "Internal Server Error"
}
```

## Using Environment Variables

Store your tokens in environment variables for convenience:

```bash
# After login, store tokens
export ACCESS_TOKEN="your_access_token_here"
export REFRESH_TOKEN="your_refresh_token_here"

# Use in requests
curl -X GET http://localhost:5000/api/v1/users/profile \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

## Postman Collection

Import this cURL collection into Postman for easier testing:

1. Open Postman
2. Click Import
3. Select "Raw text"
4. Paste the cURL commands
5. Click Import

## Rate Limiting

The API has rate limiting enabled:

- **General endpoints**: 100 requests per 15 minutes
- **Auth endpoints**: 5 requests per 15 minutes

If you exceed the limit, you'll receive:

```json
{
  "message": "Too many requests from this IP, please try again later."
}
```

## Testing with HTTPie

Alternative to cURL using HTTPie:

```bash
# Register
http POST localhost:5000/api/v1/auth/register \
  name="John Doe" \
  email="john@example.com" \
  password="Password123"

# Login
http POST localhost:5000/api/v1/auth/login \
  email="john@example.com" \
  password="Password123"

# Get profile
http GET localhost:5000/api/v1/users/profile \
  Authorization:"Bearer YOUR_ACCESS_TOKEN"
```
