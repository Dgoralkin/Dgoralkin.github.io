/*-- ====================================================================
  File: meals.js
  Description: Express route module for the "Meals" page.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-10

  Purpose:
    - Handles routing requests to the /meals endpoint 
        and directs them to the appropriate controller for processing.
===================================================================== */

// Import the Express framework and create a router instance
const express = require('express');
const router = express.Router();

// Handles the logic for rendering the Meals page
const ctrlMain = require('../controllers/meals');

// When a GET request is made to /meals, invoke the meals method from ctrlMain
router.get('/meals', ctrlMain.meals);

module.exports = router;
