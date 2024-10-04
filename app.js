const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const greetingsRouter = require('./routes/greetings');
const path = require('path');
const fs = require('fs');

// Use PORT from environment variables or default to 3000
const port = process.env.PORT || 3000;

// Middleware to parse JSON
const app = express();
app.use(express.json());

// Ensure the data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log(`Created data directory at ${dataDir}`);
}

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API with SQLite and OpenAPI',
    version: '1.0.0',
    description: 'A simple CRUD API using Express, SQLite, and documented with OpenAPI',
  },
  servers: [
    {
      url: `http://localhost:${port}`,
    },
  ],
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Path to the API docs
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// Save the OpenAPI schema to a JSON file
const outputPath = path.join(__dirname, 'swagger.json');
fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));
console.log(`OpenAPI schema saved to ${outputPath}`);

// Use Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount the greetings router
app.use('/api/greetings', greetingsRouter);

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Greetings API. Visit /api-docs for API documentation.');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`API docs available at http://localhost:${port}/api-docs`);
});