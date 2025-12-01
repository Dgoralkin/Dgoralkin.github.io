/* ========================================================================================
  File: lidsSchema.js
  Description: Path definition for the lids collection schema.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-12

  Purpose:
    - This file defines the Mongoose schema for the leads collection in MongoDB.
    - It specifies the structure and data types for each field in the collection.
    - The schema is then compiled into a Mongoose model for use in the application.
=========================================================================================== */

// Import the Mongoose module
const mongoose = require('mongoose');

// Structure of the travel collection in MongoDB
const lidsSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true},
    subject: { type: String, required: true},
    message: { type: String, required: true},
    createdAt: { type: Date, default: Date.now }
});

// Compile the Schema into a Mongoose model and export it
const Lids = mongoose.model('Lids', lidsSchema, 'lids');
module.exports = Lids;