/*-- ====================================================================
  File: cart.js
  Description: Express route module for the "Shopping Cart" page.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-13

  Purpose:
    - Handles routing requests to the /cart endpoint 
        and directs them to the appropriate controller for processing.
===================================================================== */

// Import the Express framework and create a router instance
const express = require('express');
const router = express.Router();

// Handles the logic for rendering the Cart page
const ctrlMain = require('../controllers/cart');

// When a GET request is made to /travel, invoke the travel method from ctrlMain
router.get('/cart', ctrlMain.showCart);

module.exports = router;
