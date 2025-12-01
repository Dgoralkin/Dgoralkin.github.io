/*-- ====================================================================
  File: contact.js
  Description: Express route module for the "Contact" page.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-10

  Purpose:
    - Handles routing requests to the /contact endpoint 
        and directs them to the appropriate controller for processing.
===================================================================== */

// Import the Express framework and create a router instance
const express = require('express');
const router = express.Router();

// Handles the logic for rendering the Contact Us page
const ctrlMain = require('../controllers/contact');

// When a GET request is made to /contact, invoke the getContactUs method from controller
router.get('/contact', ctrlMain.getContactUs);

module.exports = router;
