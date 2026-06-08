const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PrimeTrade API',
      version: '1.0.0',
      description: 'Scalable REST API with JWT Authentication & Role-Based Access Control',
      contact: {
        name: 'PrimeTrade Dev Team',
        email: 'dev@primetrade.ai',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id:        { type: 'integer', example: 1 },
            name:      { type: 'string',  example: 'Arulmozhi John' },
            email:     { type: 'string',  example: 'john@example.com' },
            role:      { type: 'string',  enum: ['USER', 'ADMIN'] },
            createdAt: { type: 'string',  format: 'date-time' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            id:          { type: 'integer', example: 1 },
            title:       { type: 'string',  example: 'Build API' },
            description: { type: 'string',  example: 'Build REST API with Node.js' },
            status:      { type: 'string',  enum: ['pending', 'in-progress', 'completed'] },
            userId:      { type: 'integer', example: 1 },
            createdAt:   { type: 'string',  format: 'date-time' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string',  example: 'Error message here' },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string',  example: 'Operation successful' },
            data:    { type: 'object' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/v1/*.js'], // reads JSDoc comments from route files
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;