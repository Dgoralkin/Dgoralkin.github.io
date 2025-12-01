/* ========================================================================================
  File: contact_api.js
  Description: Route module for the Contact page API.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-11

  Purpose:
    - This file routes the process to the contact_api.js controller in app_api directory.
    - Defines the endpoint `/contact` and pass the content
        to the 'contactController.getContactUsForm'.
    - Handles GET requests to fetch contact form details.
    - API router handles POST requests to submit contact form data.
    - Defines the endpoint `/contact` to handle POST requests.
=========================================================================================== */

// Import express module and create a router object
const express = require("express");
const router = express.Router();

// Import the contact controller module
const contactController = require("../controllers/contact_api");

// Defines the endpoint `/contact` and pass the content to the 'contactController.getContactUsForm'.
// Handles GET requests to fetch data to populate the contact form page.
// Also defines POST method to submit contact form data and add data to the database.
router.route("/contact").get(contactController.getContactUsForm).post(contactController.submitContactForm);

// Export the router to be used in the main app
module.exports = router;