/* ========================================================================================
  File: newsSchema.js
  Description: Path definition for the news collection schema.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-12

  Purpose:
    - This file defines the Mongoose schema for the news collection in MongoDB.
    - It specifies the structure and data types for each field in the collection.
    - The schema is then compiled into a Mongoose model for use in the application.
=========================================================================================== */

// Import the Mongoose module
const mongoose = require('mongoose');

// Structure of the travel collection in MongoDB
const newsSchema = new mongoose.Schema({
  latest_news: [
    {
      title: { type: String, required: true },
      link: { type: String, required: true }
    }
  ],
  vacation_tips: [
    {
      title: { type: String, required: true },
      link: { type: String, required: true }
    }
  ],
  News_main: {
    image: { type: String, required: true },
    link: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: String, required: true },
    author: { type: String, required: true },
    content: [{ type: String, required: true }] // array of paragraphs
  }
});


// Compile the Schema into a Mongoose model and export it
const News = mongoose.model('News', newsSchema, 'news');
module.exports = News;
