/*-- ====================================================================
  File: index.js
  Description: Express route module for the "Index" homepage.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-10

  Purpose:
    - Handles routing requests to the / (index) endpoint 
        and directs them to the appropriate controller for processing.
===================================================================== */

// Import the Express framework and create a router instance
const express = require('express');
const router = express.Router();

// Handles the logic for rendering the About page
const ctrlMain = require('../controllers');

// When a GET request is made to /, invoke the index method from ctrlMain
router.get('/', ctrlMain.index);

module.exports = router;
