/* ========================================================================================
  File: db.js
  Description: Database connection script for MongoDB using Mongoose.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-11

  Purpose:
    - This code establishes a connection to the MongoDB database using Mongoose.
    - It handles connection events and errors.
    - It ensures graceful disconnection on app termination.
    - It imports and exposes the database schemas from the models directory.
=========================================================================================== */

// Import the Mongoose module
const mongoose = require('mongoose');

// Define the MongoDB connection string
// Use Atlas DB connection string which defined in environment variables.
const dbURI = process.env.ATLAS_DB_HOST;

// Connection options for Mongoose
const mongooseOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
};

// Function to connect to the database with retries and exponential backoff
// Implements retry logic with exponential backoff in case of connection failures
async function connectDB(maxRetries = 5, initialBackoffMs = 500) {
  let attempt = 0;
  let delay = initialBackoffMs;

  // Retry loop for connecting to the database
  while (attempt < maxRetries) {
    try {
      // Connect to the MongoDB Atlas database using Mongoose
      await mongoose.connect(dbURI, mongooseOptions);
      console.log("Connected to Atlas DB!");
      return;
    } catch (err) {
      // Log the error and retry after a delay
      console.error(`Attempt ${attempt + 1} failed:`, err.message);
      attempt++;
      if (attempt < maxRetries) {
        console.log(`Retrying in ${delay} ms...`);
        await new Promise(res => setTimeout(res, delay));
        delay *= 2; // exponential backoff
      } else {
        throw new Error("Could not connect to DB after maximum retries");
      }
    }
  }
}

// Initiate the database connection
connectDB();

// Registers a listener (callback function) that runs whenever the event occurs.
mongoose.connection.on('error', err => {
  console.log('Mongoose connection error:', err);
});

// Log disconnection event
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
}); 

// Close connection gracefully when app is terminated
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose disconnected on app termination');
  process.exit(0);
});

// Outout the connection state:
console.log('Connection state:', mongoose.connection.readyState);

// Import the Schemas to register them with Mongoose
require('./tripsSchema');
require('./indexSchema');
require('./roomsSchema');
require('./mealsSchema');
require('./aboutSchema');
require('./contactSchema');
module.exports = mongoose;