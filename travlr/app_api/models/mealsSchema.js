/* ========================================================================================
  File: mealsSchema.js
  Description: Path definition for the meals collection schema.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-12

  Purpose:
    - This file defines the Mongoose schema for the meals collection in MongoDB.
    - It specifies the structure and data types for each field in the collection.
    - The schema is then compiled into a Mongoose model for use in the application.
    - indexes are created on the 'meal' field for optimized querying.
=========================================================================================== */

// Import the Mongoose module
const mongoose = require('mongoose');

// Structure of the travel collection in MongoDB
const mealsSchema = new mongoose.Schema({
    meal: { type: String, required: true, index: true },    // Use meal name as index
    image: { type: String, required: true },
    description: { type: String, required: true },
    rate: {type: Number, required: true}
});

// Compile the Schema into a Mongoose model and export it
const Meals = mongoose.model('Meals', mealsSchema, 'meals');
module.exports = Meals;