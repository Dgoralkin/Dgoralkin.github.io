/* ========================================================================================
  File: userSchema.js
  Description: Mongoose model for user authentication with password hashing and JWT support.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-12

  Purpose:
  - This file defines the Mongoose schema for the user collection in MongoDB.
  - It specifies the structure and data types for each field in the collection.
  - The schema includes methods for setting passwords, validating passwords, and generating JSON Web Tokens (JWTs).
  - The schema is then compiled into a Mongoose model for use in the application.
  - Security measures such as password hashing and token expiration are implemented.
  - User schema defines parameters for Google's Time-based One Time Password authenticator.
  - The email field is indexed for uniqueness to prevent duplicate user accounts.
=========================================================================================== */

// Import the Mongoose module
const mongoose = require("mongoose");

// Import crypto and jwt modules for password hashing and token generation
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { type } = require("os");

// Structure of the user collection in MongoDB
// Define the user collection schema for users and admin.
const userSchema = new mongoose.Schema({
    fName: { type: String, default: "Guest"},                           // Default Guest first name defined for unregistered users.
    lName: { type: String, default: null},
    hash: { type: String },
    salt: { type: String },
    email: { type: String, unique: true, default: Date.now, index: true },      // Use email as unique identifier uses date as a unique placeholder.
    isRegistered: { type: Boolean, default: false },                            // An unregistered and not an Admin user is a Guest user.
    isAdmin: { type: Boolean, default: false },                                 // Used by the Angular Admin website for managing the app.  
    userSince: { type: Date, default: Date.now },                               // Store first session date
    twoFactorEnabled: { type: Boolean, default: false },                        // Indicator for the TOTP validator
    twoFactorSecret: { type: String, default: null },                           // Stores the secret key for the TOTP validator
});

// Method to set the password for this record.
// Generates a salt and hash for the given password
userSchema.methods.setPassword = function(password){

    // Create a unique salt for a particular user
    this.salt = crypto.randomBytes(16).toString('hex');

    // Hashing user's salt and password with 1000 iterations, 64 length and sha512 digest
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

// Method to validate the password on this record. Checks if a given password matches the stored one.
// Compares the given password's hash with the stored hash.
// Returns true if the password is valid (hash matches), false otherwise.
userSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');

    // Check if the computed hash matches the stored hash and return the result
    return this.hash === hash;
};

// Method to generate a JSON Web Token for the current session
// Returns the generated JWT
// The token includes the user's _id, email, name, and roles. Expires in 1 hour
userSchema.methods.generateJWT = function() {
    // Sign the Payload for our JSON Web Token
    return jwt.sign(
        {_id: this._id,
        email: this.email,
        name: this.fName,
        isRegistered: this.isRegistered,
        isAdmin: this.isAdmin},
        process.env.JWT_SECRET,         // SECRET stored in .env file
        { expiresIn: '1h' }             // Token expires an hour from creation
    );
};

// Compile the Schema into a Mongoose model and export it
const User = mongoose.model('users', userSchema);
module.exports = User;