import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'HRMS API Documentation',
    version: '1.0.0',
    description: 'Human Resource Management System API Documentation',
    contact: {
      name: 'API Support',
      email: 'support@hrms.com',
    },
    license: {
      name: 'MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 4000}/api`,
      description: 'Development server',
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
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'User ID',
          },
          name: {
            type: 'string',
            description: 'User full name',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
          },
          role: {
            type: 'string',
            enum: ['USER', 'HR', 'ADMIN'],
            description: 'User role',
          },
        },
      },
      Job: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Job ID',
          },
          title: {
            type: 'string',
            description: 'Job title',
          },
          description: {
            type: 'string',
            description: 'Job description',
          },
          department: {
            type: 'string',
            description: 'Job department',
          },
          location: {
            type: 'string',
            description: 'Job location',
          },
          salary: {
            type: 'number',
            description: 'Job salary',
          },
          status: {
            type: 'string',
            enum: ['OPEN', 'CLOSED', 'DRAFT'],
            description: 'Job status',
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Path to the API routes
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
  // Swagger page
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(`Swagger docs available at http://localhost:${process.env.PORT || 4000}/api-docs`);
};

export default swaggerDocs;