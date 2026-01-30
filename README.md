# Node.js Backend Boilerplate

Production-grade Node.js REST API boilerplate with clean architecture, focusing on best practices and maintainability.

## Features

- **Clean Architecture** - Modular design with clear separation of concerns
- **Authentication & Authorization** - JWT-based auth with access/refresh tokens and RBAC
- **Database** - MongoDB with Mongoose ODM
- **Validation** - Request validation using Zod
- **Security** - Helmet, CORS, XSS protection, NoSQL injection sanitization
- **Error Handling** - Centralized error handling middleware
- **Logging** - Structured logging with Pino
- **Rate Limiting** - Protect APIs from abuse
- **API Documentation** - Swagger/OpenAPI documentation
- **Testing** - Jest + Supertest with code coverage
- **Code Quality** - ESLint + Prettier with pre-commit hooks
- **Docker** - Multi-stage Dockerfile and docker-compose setup
- **CI/CD** - GitHub Actions workflow
- **Process Management** - PM2 configuration for production

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB
- **Validation**: Zod
- **Authentication**: JWT
- **Logging**: Pino
- **Testing**: Jest + Supertest
- **Package Manager**: Yarn

## Project Structure

```
src/
├── app.js                  # Express app setup
├── index.js               # Server entry point
├── routes.js              # Route registry
├── config/                # Configuration files
├── docs/                  # API documentation
├── modules/               # Feature modules
│   ├── auth/             # Authentication module
│   └── user/             # User module
├── middlewares/          # Express middlewares
├── utils/                # Utility functions
├── tests/                # Test files
└── jobs/                 # Background jobs
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 5+
- Yarn

### Installation

1. Clone the repository
```bash
git clone <repo-url>
cd nodejs-backend-boilerplate
```

2. Install dependencies
```bash
yarn install
```

3. Setup environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start MongoDB (if running locally)
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7-jammy
```

5. Run the application
```bash
# Development
yarn dev

# Production
yarn start
```

## Docker Setup

### Using Docker Compose

```bash
# Start all services
docker-compose -f docker/docker-compose.yml up -d

# View logs
docker-compose -f docker/docker-compose.yml logs -f

# Stop services
docker-compose -f docker/docker-compose.yml down
```

### Building Docker Image

```bash
docker build -f docker/Dockerfile -t nodejs-backend:latest .
```

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:5000/api-docs`
- Health Check: `http://localhost:5000/health`

## Testing

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test
```

## Code Quality

```bash
# Run linter
yarn lint

# Fix linting issues
yarn lint:fix

# Format code
yarn format
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user

### Users

- `GET /api/v1/users/profile` - Get current user profile
- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get user by ID (Admin only)
- `PATCH /api/v1/users/:id` - Update user (Admin only)
- `DELETE /api/v1/users/:id` - Delete user (Admin only)

## Environment Variables

Key environment variables (see `.env.example` for complete list):

- `NODE_ENV` - Application environment (development/production/test)
- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_ACCESS_SECRET` - JWT access token secret
- `JWT_REFRESH_SECRET` - JWT refresh token secret

## Production Deployment

### Using PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start pm2.config.js

# Monitor
pm2 monit

# View logs
pm2 logs

# Restart
pm2 restart all
```

## Security Best Practices

- Environment variables for sensitive data
- Password hashing with bcrypt
- JWT token-based authentication
- Rate limiting on authentication endpoints
- Input validation and sanitization
- Security headers with Helmet
- CORS configuration
- XSS protection
- NoSQL injection prevention

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
