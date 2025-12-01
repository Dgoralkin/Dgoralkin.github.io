/*-- ====================================================================
  File: rooms.js
  Description: Express route module for the "Rooms" page.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-10

  Purpose:
    - Handles routing requests to the /rooms endpoint 
        and directs them to the appropriate controller for processing.
===================================================================== */

// Import the Express framework and create a router instance
const express = require('express');
const router = express.Router();

// Handles the logic for rendering the Rooms page
const ctrlMain = require('../controllers/rooms');

// When a GET request is made to /rooms, invoke the rooms method from ctrlMain
router.get('/rooms', ctrlMain.rooms);

module.exports = router;
