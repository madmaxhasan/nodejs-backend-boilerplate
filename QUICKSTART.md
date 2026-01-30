# Quick Start Guide

Get the boilerplate running in 5 minutes.

## Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- Yarn

## Installation Steps

### 1. Install Dependencies

```bash
yarn install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` and update:

- `MONGODB_URI` - Your MongoDB connection string
- `JWT_ACCESS_SECRET` - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `JWT_REFRESH_SECRET` - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 3. Start MongoDB

**Option A: Using Docker**

```bash
docker run -d -p 27017:27017 --name mongodb mongo:7-jammy
```

**Option B: Local MongoDB**

```bash
mongod
```

**Option C: MongoDB Atlas**
Use your connection string from MongoDB Atlas dashboard

### 4. Seed Database (Optional)

```bash
yarn seed
```

This creates:

- Admin user: `admin@example.com` / `Admin123!`
- Regular user: `user@example.com` / `User123!`

### 5. Start Development Server

```bash
yarn dev
```

Server will start at `http://localhost:5000`

## Test the API

### Health Check

```bash
curl http://localhost:5000/health
```

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

### Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

## View API Documentation

Open in browser: `http://localhost:5000/api-docs`

## Run Tests

```bash
yarn test
```

## Next Steps

- Read [README.md](./README.md) for full documentation
- Check [ARCHITECTURE.md](./docs/ARCHITECTURE.md) to understand the structure
- See [API_EXAMPLES.md](./docs/API_EXAMPLES.md) for more API examples
- Review [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for production deployment

## Common Issues

### MongoDB Connection Error

- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify network connectivity

### Port Already in Use

```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

### JWT Token Errors

- Ensure `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are set in `.env`
- Secrets must be at least 32 characters

## Docker Quick Start

```bash
# Start all services
docker-compose -f docker/docker-compose.yml up -d

# View logs
docker-compose -f docker/docker-compose.yml logs -f

# Access API
curl http://localhost:5000/health
```

## Scripts

- `yarn dev` - Start development server with hot reload
- `yarn start` - Start production server
- `yarn test` - Run tests with coverage
- `yarn lint` - Run ESLint
- `yarn format` - Format code with Prettier
- `yarn seed` - Seed database with sample data

## Directory Structure

```
src/
├── app.js              # Express app configuration
├── index.js            # Server entry point
├── routes.js           # Route registry
├── config/             # App configuration
├── docs/               # Swagger documentation
├── modules/            # Feature modules (auth, user)
├── middlewares/        # Express middlewares
├── utils/              # Utility functions
├── tests/              # Test files
└── jobs/               # Background jobs
```

## Support

For issues or questions:

1. Check documentation in `/docs`
2. Review error logs
3. Open an issue on GitHub

Happy coding! 🚀
