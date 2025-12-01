/* ========================================================================================
  File: tripsSchema.js
  Description: Path definition for the travel collection schema.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-12

  Purpose:
    - This file defines the Mongoose schema for the travel collection in MongoDB.
    - It specifies the structure and data types for each field in the collection.
    - The schema is then compiled into a Mongoose model for use in the application.
    - indexes are created on the 'length of stay', 'date', and 'price' fields for optimized querying.
    - compound index on length + start + perPerson for multi-criteria queries for searching performance.
=========================================================================================== */

// Import the Mongoose module
const mongoose = require('mongoose');

// Structure of the travel collection in MongoDB
const tripSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, index: true }, // Use code as index
    name: { type: String, required: true, unique: true,},
    length: { type: String, required: true, index: true },             // Use trip length as index
    start: { type: Date, required: true, index: true },                // Use start date as index
    resort: { type: String, required: true },
    perPerson: { type: Number, required: true, index: true },          // Use perPerson as index
    image: { type: String, required: true },
    description: { type: String, required: true }
});

// Compound index on length + start + perPerson
tripSchema.index({ length: 1, start: 1, perPerson: 1 });

// Compile the Schema into a Mongoose model and export it
const Trip = mongoose.model('Travel', tripSchema, 'travel');
module.exports = Trip;