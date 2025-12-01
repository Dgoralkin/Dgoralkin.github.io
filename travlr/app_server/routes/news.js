/*-- ====================================================================
  File: news.js
  Description: Express route module for the "News" page.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-10

  Purpose:
    - Handles routing requests to the /news endpoint 
        and directs them to the appropriate controller for processing.
===================================================================== */


// Import the Express framework and create a router instance
const express = require('express');
const router = express.Router();

// Handles the logic for rendering the News page
const ctrlMain = require('../controllers/news');

// When a GET request is made to /news, invoke the news method from ctrlMain
router.get('/news', ctrlMain.news);

module.exports = router;
