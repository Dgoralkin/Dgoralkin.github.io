/*-- ====================================================================
  File: registerAndLogin.js
  Description: Express route module for the user login and registration page.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-11-19
  Updated: NA

  Purpose:
    - Handles routing requests to the login page 
        and directs users to the appropriate controller for processing.
===================================================================== */

// Import express module and create a router object
const express = require("express");
const router = express.Router();

// Handles the logic for rendering the About page
const ctrlMain = require('../controllers/registerAndLogin');

// When a GET request is made to /, invoke the index method from ctrlMain
router.get('/login', ctrlMain.register_login);

module.exports = router;