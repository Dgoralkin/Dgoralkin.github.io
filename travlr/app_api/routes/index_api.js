/* ========================================================================================
  File: index_api.js
  Description: Route module for the index (home) page API.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-11

  Purpose:
    - This file routes the process to the index_api.js controller in app_api directory
    - Defines the endpoint `/` (homepage) and pass the content
        to the 'indexController.allArticlesList' function.
=========================================================================================== */

// Import express module and create a router object
const express = require("express");
const router = express.Router();

// Import the index controller module
const indexController = require("../controllers/index_api");

// Define the route for the index page API and link to controller function
router.route("/").get(indexController.allArticlesList);

// Export the router to be used in the main app
module.exports = router;