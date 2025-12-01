/*-- ====================================================================
  File: travel.js
  Description: Express route module for the "Travel" page.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-10

  Purpose:
    - Handles routing requests to the /travel endpoint 
        and directs them to the appropriate controller for processing.
===================================================================== */

// Import the Express framework and create a router instance
const express = require('express');
const router = express.Router();

// Handles the logic for rendering the About page
const ctrlMain = require('../controllers/travel');

// When a GET request is made to /travel, invoke the travel method from ctrlMain
router.get('/travel', ctrlMain.travel);

module.exports = router;
