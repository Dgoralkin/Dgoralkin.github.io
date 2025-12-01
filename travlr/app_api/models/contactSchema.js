/* ========================================================================================
  File: contactSchema.js
  Description: Path definition for the contact collection schema.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-12

  Purpose:
    - This file defines the Mongoose schema for the contact collection in MongoDB.
    - It specifies the structure and data types for each field in the collection.
    - The schema is then compiled into a Mongoose model for use in the application.
    - required index on Address field for optimized querying.
=========================================================================================== */

// Import the Mongoose module
const mongoose = require('mongoose');

// Structure of the travel collection in MongoDB
const contactSchema = new mongoose.Schema({
    Company_name: { type: String, required: true },
    Address: { type: String, required: true, },
    Telephone: { type: String, required: true },
    Email: { type: String, required: true },
    GitHub: { type: String, required: true },
});

// Compile the Schema into a Mongoose model and export it
const Contact = mongoose.model('Contact', contactSchema, 'contact');
module.exports = Contact;