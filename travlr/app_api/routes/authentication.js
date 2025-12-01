/* ========================================================================================
  File: authentication.js
  Description: Route module for user authentication.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-11

  Purpose:
  - This file routes the process to the authentication controller in app_api directory.
  - Defines the endpoint `/register` and `/login` for user authentication.
  - Handles user registration and login requests.
=========================================================================================== */

// Import express module and create a router object
const express = require("express");
const router = express.Router();

// Import the authentication controller module
const authController = require("../controllers/authentication");

// Defines the endpoint '/checkSession' for client side checking if a session exist.
router.route("/checkSession").get(authController.checkSession);        // Validates is a session or a token exist.

// Defines the endpoint '/register', '/login', and /guest for user creation and authentication.
router.route("/register").post(authController.register);               // Registers new users.
router.route("/login").post(authController.login);                     // Sign existing users in.
router.route("/logout").post(authController.logout);                   // Log existing users out.
router.route("/guest").post(authController.registerGuest);             // Creates a dummy account for a guest user.

// Export the router object to be used in other parts of the application
module.exports = router;