const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const env = require('../config/env');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js Backend Boilerplate API',
      version: '1.0.0',
      description: 'Production-grade Node.js REST API with clean architecture',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.port}${env.apiPrefix}`,
        description: 'Development server',
      },
      {
        url: `https://api.example.com${env.apiPrefix}`,
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/modules/**/*.routes.js', './src/docs/openapi.yaml'],
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
