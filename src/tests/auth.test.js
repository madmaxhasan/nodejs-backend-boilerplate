const request = require('supertest');
const app = require('../app');
const User = require('../modules/user/user.model');
const { USER_ROLES } = require('../utils/constants');

describe('Auth Endpoints', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
      };

      const res = await request(app).post('/api/v1/auth/register').send(userData).expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toHaveProperty('_id');
      expect(res.body.data.user.email).toBe(userData.email);
      expect(res.body.data.user).not.toHaveProperty('password');
      expect(res.body.data.tokens).toHaveProperty('accessToken');
      expect(res.body.data.tokens).toHaveProperty('refreshToken');
    });

    it('should fail if email already exists', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
      };

      await User.create(userData);

      const res = await request(app).post('/api/v1/auth/register').send(userData).expect(409);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Email already registered');
    });

    it('should fail with invalid password', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'weak',
      };

      const res = await request(app).post('/api/v1/auth/register').send(userData).expect(422);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
      });
    });

    it('should login with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'Password123',
      };

      const res = await request(app).post('/api/v1/auth/login').send(credentials).expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toHaveProperty('_id');
      expect(res.body.data.tokens).toHaveProperty('accessToken');
      expect(res.body.data.tokens).toHaveProperty('refreshToken');
    });

    it('should fail with invalid email', async () => {
      const credentials = {
        email: 'wrong@example.com',
        password: 'Password123',
      };

      const res = await request(app).post('/api/v1/auth/login').send(credentials).expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email or password');
    });

    it('should fail with invalid password', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'WrongPassword123',
      };

      const res = await request(app).post('/api/v1/auth/login').send(credentials).expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should logout authenticated user', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
      });

      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'test@example.com', password: 'Password123' });

      const { accessToken } = loginRes.body.data.tokens;

      const res = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Logout successful');

      const updatedUser = await User.findById(user._id).select('+refreshToken');
      expect(updatedUser.refreshToken).toBeNull();
    });

    it('should fail without authentication', async () => {
      const res = await request(app).post('/api/v1/auth/logout').expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should refresh tokens with valid refresh token', async () => {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
      });

      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'test@example.com', password: 'Password123' });

      const { refreshToken } = loginRes.body.data.tokens;

      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.tokens).toHaveProperty('accessToken');
      expect(res.body.data.tokens).toHaveProperty('refreshToken');
    });

    it('should fail with invalid refresh token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });
});

describe('User Endpoints', () => {
  let accessToken;
  let adminToken;

  beforeEach(async () => {
    await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'Password123',
    });

    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Password123',
      role: USER_ROLES.ADMIN,
    });

    const userLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'user@example.com', password: 'Password123' });
    accessToken = userLogin.body.data.tokens.accessToken;

    const adminLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@example.com', password: 'Password123' });
    adminToken = adminLogin.body.data.tokens.accessToken;
  });

  describe('GET /api/v1/users/profile', () => {
    it('should get current user profile', async () => {
      const res = await request(app)
        .get('/api/v1/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('user@example.com');
    });

    it('should fail without authentication', async () => {
      const res = await request(app).get('/api/v1/users/profile').expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/users', () => {
    it('should get all users as admin', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.users).toBeInstanceOf(Array);
      expect(res.body.data.users.length).toBeGreaterThan(0);
    });

    it('should fail as regular user', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });
});
