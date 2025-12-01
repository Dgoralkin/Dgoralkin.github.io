/* ========================================================================================
  File: roomsSchema.js
  Description: Path definition for the rooms collection schema.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-12

  Purpose:
    - This file defines the Mongoose schema for the rooms collection in MongoDB.
    - It specifies the structure and data types for each field in the collection.
    - The schema is then compiled into a Mongoose model for use in the application.
    - indexes are created on the 'name' field for optimized querying.
=========================================================================================== */

// Import the Mongoose module
const mongoose = require('mongoose');

// Structure of the travel collection in MongoDB
const roomSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },    // Use room name code as index
    image: { type: String, required: true },
    description: { type: String, required: true },
    rate: { type: Number, required: true }
});

// Compound index on name + perPerson
roomSchema.index({ name: 1, rate: 1 });

// Compile the Schema into a Mongoose model and export it
const Room = mongoose.model('Room', roomSchema, 'room');
module.exports = Room;