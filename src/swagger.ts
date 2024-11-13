import swaggerAutogen from 'swagger-autogen';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import fs from 'fs';

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/routes/auth.route.ts'];

// Swagger autogen configuration
const doc = {
  info: {
    title: 'API Documentation',
    description: 'Description of the API',
  },
  host: 'localhost:8000',
  schemes: ['http'],
};

// Function to generate swagger_output.json if it doesn't exist
const generateSwaggerFile = async () => {
  if (!fs.existsSync(outputFile)) {
    console.log('Generating swagger_output.json...');
    await swaggerAutogen()(outputFile, endpointsFiles, doc);
    console.log('swagger_output.json generated.');
  }
};

// Set up Swagger UI
export const setupSwagger = async (app: Express): Promise<void> => {
  // Ensure swagger_output.json is generated
  await generateSwaggerFile();

  const swaggerFile = require('./swagger_output.json'); // JSON file containing generated Swagger documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
  console.log('Swagger docs are available at /api-docs');
};
