/*-- ====================================================================
  File: setup2FA.js
  Description: Express route module for the Two Factor Authentication page.
  Author: Daniel Gorelkin
  Version: 1.0
  Created: 2025-11-24
  Updated:

  Purpose:
    - Handles routing requests to the 2fa/setup endpoint via GET request
      and directs them to the appropriate controller for processing.
    - Implements the auth interceptor to prevent unauthorized access to the page
      by demanding and validating the token 
===================================================================== */

// Import the Express framework and create a router instance
const express = require('express');
const router = express.Router();

// Handles the logic for rendering the 2FA page
const authCtrl = require('../controllers/setup2FA');

// Require token in header to render the page
const auth = require("../../middleware/auth");

// method from auth, and render page if token is set.
// POST → receives QR, secret, message, stores in session

// When a GET request is made to /2fa/setup, invoke the authentication interceptor- 
router.get('/2fa/setup', auth, authCtrl.renderSetup2FA);

module.exports = router;
