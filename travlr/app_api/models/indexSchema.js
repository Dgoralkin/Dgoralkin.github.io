/* ========================================================================================
  File: indexSchema.js
  Description: Path definition for the index collection schema.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-12

  Purpose:
    - This file defines the Mongoose schema for the index collection in MongoDB.
    - It specifies the structure and data types for each field in the collection.
    - The schema is then compiled into a Mongoose model for use in the application.
=========================================================================================== */

// Import the Mongoose module
const mongoose = require('mongoose');

// Structure of the travel collection in MongoDB
const indexSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    heading_text: {type: String, required: true },
    // arrays of objects for the homepage slider
    Slider_Images: [{ title: String, description: String, image: String, image_alt: String }],
    Latest_Blog: {type: String, required: true },
    // arrays of objects for Blog_Entries
    Blog_Entries: [{ title: String, link: String, date: String, excerpt: String }],
    Testimonials_Heading: { type: String, required: true, index: true },
    // arrays of objects for Testimonials
    Testimonials: [{ text: String, author: String, link: String }]
});

// Compile the Schema into a Mongoose model and export it
const Index = mongoose.model('Index', indexSchema, 'index');
module.exports = Index;