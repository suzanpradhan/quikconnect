import swaggerAutogen from 'swagger-autogen';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/routes/auth.route.ts', './src/routes/userInfo.route.ts', './src/routes/chat.route.ts'];

const doc = {
  info: {
    title: 'API Documentation',
    description: 'Description of the API',
  },
  host: 'https://quickconnect.suzanpradhan.com.np',
  // host: '192.168.1.8:8001',
  basePath: '/api',
  schemes: ['https', 'http'],
  tags: [
    { name: 'chat', description: 'Endpoints related to chat' },
    { name: 'auth', description: 'Authentication endpoints' },
    { name: 'account', description: 'Account-related endpoints' },
  ],
  paths: {},
};

const generateSwaggerFile = async (url: string) => {
  const domain = url.includes('://') ? url.split('//')[1] : url; // Handle URLs with or without protocol
  doc.host = domain.split('/')[0]; // Extract only the domain i.e:"quickconnect.suzanpradhan.com.np
  await swaggerAutogen()(outputFile, endpointsFiles, doc);
  console.log('swagger_output.json generated.');
};

// Set up Swagger UI
export const setupSwagger = async (app: Express, url: string): Promise<void> => {
  // Generate Swagger file with dynamic host
  await generateSwaggerFile(url);

  // Serve Swagger UI
  const swaggerFile = require('./swagger_output.json'); // Generated file
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
  console.log('Swagger docs are available at /api-docs');
};
