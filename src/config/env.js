const dotenv = require('dotenv');
const { z } = require('zod');

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  API_PREFIX: z.string().default('/api/v1'),

  MONGODB_URI: z.string(),
  MONGODB_URI_TEST: z.string().optional(),

  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRATION: z.string().default('15m'),
  JWT_REFRESH_EXPIRATION: z.string().default('7d'),

  CORS_ORIGIN: z.string().default('*'),

  RATE_LIMIT_WINDOW: z.string().default('15'),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),

  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

const parseEnv = () => {
  try {
    const parsed = envSchema.parse(process.env);
    return {
      nodeEnv: parsed.NODE_ENV,
      port: parseInt(parsed.PORT, 10),
      apiPrefix: parsed.API_PREFIX,

      db: {
        uri:
          parsed.NODE_ENV === 'test'
            ? parsed.MONGODB_URI_TEST || parsed.MONGODB_URI
            : parsed.MONGODB_URI,
      },

      jwt: {
        accessSecret: parsed.JWT_ACCESS_SECRET,
        refreshSecret: parsed.JWT_REFRESH_SECRET,
        accessExpiration: parsed.JWT_ACCESS_EXPIRATION,
        refreshExpiration: parsed.JWT_REFRESH_EXPIRATION,
      },

      cors: {
        origin: parsed.CORS_ORIGIN,
      },

      rateLimit: {
        windowMs: parseInt(parsed.RATE_LIMIT_WINDOW, 10) * 60 * 1000,
        max: parseInt(parsed.RATE_LIMIT_MAX_REQUESTS, 10),
      },

      logging: {
        level: parsed.LOG_LEVEL,
      },
    };
  } catch (error) {
    console.error('❌ Invalid environment variables:', error.errors);
    process.exit(1);
  }
};

module.exports = parseEnv();
