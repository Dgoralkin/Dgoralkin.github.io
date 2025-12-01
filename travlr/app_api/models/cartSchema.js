/* ========================================================================================
  File: cartSchema.js
  Description: Path definition for the cart collection schema.
  Author: Daniel Gorelkin
  Version: 1.0
  Created: 2025-11-13
  Updated: NA

  Purpose:
    - This file defines the Mongoose schema for the cart collection in MongoDB Atlas.
    - It specifies the structure and data types for each field in the collection.
    - The schema is then compiled into a Mongoose model for use in the application.
    - Indexes are created on the unique item '_id', and the 'dbCollection' and 'name', in which the item is 
      stored in the database for optimized querying.
    - Each record also keeps track of the amount of added items to the cart and the image path as well
      as the collection in the database where the object lives.
=========================================================================================== */

// Import the Mongoose module
const mongoose = require('mongoose');

// Structure of the cart collection in MongoDB
const cartSchema = new mongoose.Schema({
    user_id: { type: String, required: true, index: true},
    item_id: { type: String, required: true },
    code: {type: String, required: true},
    name: {type: String, required: true, index: true},                      // Use name as index
    dbCollection: { type: String, required: true, index: true },            // Use dbCollection as index
    rate: { type: Number, required: true},
    image: { type: String, required: true},
    quantity: { type: Number, required: true, default: 1, min: 1},          // Define minimum on the field
    addToCartDate: {type: Date, default: Date}
});

// Compound index on length + start + perPerson
cartSchema.index({ user_id: 1, item_id: 1 });

// Compile the Schema into a Mongoose model and export it
const Cart = mongoose.model('Cart', cartSchema, 'cart');
module.exports = Cart;