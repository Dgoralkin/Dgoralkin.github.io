/* ========================================================================================
  File: setup2FA.js
  Description: Route module for setting up the 2FA for user.
  Author: Daniel Gorelkin
  Version: 1.0
  Created: 2025-11-24
  Updated:

  Purpose:
  - This file routes the process to the Two Factor Authentication (TOTP) controller in app_api directory.
  - Defines the endpoint `/auth/2fa/setup` for user authentication.
  - Handles user registration process via POST requests.
=========================================================================================== */

// Import express module and create a router object
const express = require("express");
const router = express.Router();

// Import the authentication controller module
const twoFactorAuthController = require("../controllers/twoFactorAuth");

// Defines the endpoint 'auth/2fa/setup' for user two factor authentication setup.
router.route("/2fa/setup").post(twoFactorAuthController.setup2FA);                 // Registers new users for 2FA.

// Defines the endpoint 'auth/2fa/verify' for user two factor authentication setup.
router.route("/2fa/verify").post(twoFactorAuthController.verify2FA);               // Verifies users on login for 2FA.

// Export the router object to be used in other parts of the application
module.exports = router;