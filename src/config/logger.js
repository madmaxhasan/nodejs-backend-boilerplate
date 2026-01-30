const pino = require('pino');
const env = require('./env');

const logger = pino({
  level: env.logging.level,
  transport:
    env.nodeEnv !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            ignore: 'pid,hostname',
            translateTime: 'SYS:standard',
          },
        }
      : undefined,
});

module.exports = logger;
