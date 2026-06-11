const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Student Management API',
    version: '1.0.0',
    description:
      'REST API for user authentication and student management with role-based access control.',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local development server',
    },
  ],
  tags: [
    {
      name: 'Health',
      description: 'API status endpoints',
    },
    {
      name: 'Auth',
      description: 'Authentication and profile endpoints',
    },
    {
      name: 'Students',
      description: 'Student management endpoints',
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
      SuccessResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Request completed successfully',
          },
          data: {
            type: 'object',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Error message here',
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '665f1c2e9f1c2b0012a34567',
          },
          name: {
            type: 'string',
            example: 'Admin User',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'admin@example.com',
          },
          role: {
            type: 'string',
            enum: ['admin', 'teacher', 'student'],
            example: 'admin',
          },
        },
      },
      Student: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '665f1c2e9f1c2b0012a34568',
          },
          firstName: {
            type: 'string',
            example: 'John',
          },
          lastName: {
            type: 'string',
            example: 'Doe',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'john@example.com',
          },
          course: {
            type: 'string',
            example: 'JavaScript',
          },
          age: {
            type: 'number',
            example: 20,
          },
          score: {
            type: 'number',
            minimum: 0,
            maximum: 100,
            example: 85,
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive'],
            example: 'active',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: {
            type: 'string',
            example: 'Admin User',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'admin@example.com',
          },
          password: {
            type: 'string',
            minLength: 6,
            example: 'password123',
          },
          role: {
            type: 'string',
            enum: ['admin', 'teacher', 'student'],
            default: 'teacher',
            example: 'admin',
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'admin@example.com',
          },
          password: {
            type: 'string',
            example: 'password123',
          },
        },
      },
      StudentRequest: {
        type: 'object',
        required: ['firstName', 'lastName', 'email', 'course', 'age'],
        properties: {
          firstName: {
            type: 'string',
            example: 'John',
          },
          lastName: {
            type: 'string',
            example: 'Doe',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'john@example.com',
          },
          course: {
            type: 'string',
            example: 'JavaScript',
          },
          age: {
            type: 'number',
            example: 20,
          },
          score: {
            type: 'number',
            minimum: 0,
            maximum: 100,
            example: 85,
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive'],
            default: 'active',
            example: 'active',
          },
        },
      },
    },
  },
  paths: {
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Check API health',
        responses: {
          200: {
            description: 'API is running',
            content: {
              'application/json': {
                example: {
                  success: true,
                  message: 'API health check passed',
                  data: {
                    status: 'ok',
                    uptime: 12.345,
                    timestamp: '2026-06-11T10:00:00.000Z',
                    environment: 'development',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RegisterRequest',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'User registered successfully',
            content: {
              'application/json': {
                example: {
                  success: true,
                  message: 'User registered successfully',
                  data: {
                    user: {
                      _id: '665f1c2e9f1c2b0012a34567',
                      name: 'Admin User',
                      email: 'admin@example.com',
                      role: 'admin',
                    },
                    token: 'JWT_TOKEN',
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation error or duplicate email',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                example: {
                  success: true,
                  message: 'Login successful',
                  data: {
                    user: {
                      _id: '665f1c2e9f1c2b0012a34567',
                      name: 'Admin User',
                      email: 'admin@example.com',
                      role: 'admin',
                    },
                    token: 'JWT_TOKEN',
                  },
                },
              },
            },
          },
          401: {
            description: 'Invalid email or password',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/profile': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user profile',
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: 'Profile fetched successfully',
            content: {
              'application/json': {
                example: {
                  success: true,
                  message: 'Profile fetched successfully',
                  data: {
                    user: {
                      _id: '665f1c2e9f1c2b0012a34567',
                      name: 'Admin User',
                      email: 'admin@example.com',
                      role: 'admin',
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Missing or invalid token',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/api/students': {
      get: {
        tags: ['Students'],
        summary: 'Get all students',
        description: 'Allowed roles: admin, teacher, student.',
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            in: 'query',
            name: 'course',
            schema: {
              type: 'string',
            },
            example: 'JavaScript',
          },
          {
            in: 'query',
            name: 'status',
            schema: {
              type: 'string',
              enum: ['active', 'inactive'],
            },
            example: 'active',
          },
          {
            in: 'query',
            name: 'search',
            schema: {
              type: 'string',
            },
            example: 'john',
          },
          {
            in: 'query',
            name: 'sort',
            schema: {
              type: 'string',
            },
            examples: {
              ascendingScore: {
                value: 'score',
              },
              descendingScore: {
                value: '-score',
              },
            },
          },
        ],
        responses: {
          200: {
            description: 'Students fetched successfully',
            content: {
              'application/json': {
                example: {
                  success: true,
                  message: 'Students fetched successfully',
                  data: [
                    {
                      _id: '665f1c2e9f1c2b0012a34568',
                      firstName: 'John',
                      lastName: 'Doe',
                      email: 'john@example.com',
                      course: 'JavaScript',
                      age: 20,
                      score: 85,
                      status: 'active',
                    },
                  ],
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Students'],
        summary: 'Create a student',
        description: 'Allowed role: admin.',
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/StudentRequest',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Student created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          403: {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/api/students/{id}': {
      get: {
        tags: ['Students'],
        summary: 'Get one student',
        description: 'Allowed roles: admin, teacher, student.',
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            example: '665f1c2e9f1c2b0012a34568',
          },
        ],
        responses: {
          200: {
            description: 'Student fetched successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          404: {
            description: 'Student not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
      put: {
        tags: ['Students'],
        summary: 'Update a student',
        description: 'Allowed roles: admin, teacher.',
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            example: '665f1c2e9f1c2b0012a34568',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/StudentRequest',
              },
              example: {
                course: 'Node.js',
                score: 92,
                status: 'active',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Student updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          403: {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Students'],
        summary: 'Delete a student',
        description: 'Allowed role: admin.',
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
            example: '665f1c2e9f1c2b0012a34568',
          },
        ],
        responses: {
          200: {
            description: 'Student deleted successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          403: {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = swaggerDocument;
