/* ========================================================================================
  File: aboutSchema.js
  Description: Path definition for the about collection schema.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-12

  Purpose:
    - This file defines the Mongoose schema for the about collection in MongoDB.
    - It specifies the structure and data types for each field in the collection.
    - The schema is then compiled into a Mongoose model for use in the application.
=========================================================================================== */

// Import the Mongoose module
const mongoose = require('mongoose');

// Structure of the travel collection in MongoDB
const aboutSchema = new mongoose.Schema({
    content: {
        paragraph_1: { type: String, required: true },
        paragraph_2: { type: String, required: true }
    },
    community: { type: String, required: true },
    details: { type: String, required: true },
    crews: { type: String, required: true },
    amenities: { type: String, required: true }
});

// Compile the Schema into a Mongoose model and export it
const About = mongoose.model('About', aboutSchema, 'about');
module.exports = About;