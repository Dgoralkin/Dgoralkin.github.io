/* ========================================================================================
  File: travel_api.js
  Description: Route module for the Travel page API.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-11

  Purpose:
    - This file routes the process to the travel_api.js controller in app_api directory.
    - Defines the endpoint `/travel` and pass the content
        to the 'tripsController.allTripsList' function.
    - Also defines POST method to add a new trip, protected by JWT authentication.
    - Defines the endpoint `/travel/:tripCode` and pass the content
        to the 'tripsController.findTrip' function.
    - Also defines PUT method to update a trip, protected by JWT authentication.
=========================================================================================== */

// Import express module and create a router object
const express = require("express");
const router = express.Router();

// Import the travel controller module
const tripsController = require("../controllers/travel_api");

// Import the authentication controller module
const { authenticateJWT } = require("../controllers/authentication");

// Defines the endpoint `/travel` and pass the content to the 'tripsController.allTripsList' function.
// Also defines POST method to add a new trip, protected by JWT authentication.
// Express calls authenticateJWT before running the route logic.
router.route("/travel")
.get(tripsController.allTripsList)                          // GET  -> Fetch all trips from DB.travel collection.
.post(authenticateJWT, tripsController.tripsAddTrip);       // POST -> Add an article to DB.travel collection.

// Defines the endpoint `/travel/:tripCode` and pass the content to the 'tripsController.findTrip' function.
// Also defines PUT method to update a trip, protected by JWT authentication.
// Express calls authenticateJWT before running the route logic.
// The :tripCode is a route parameter used to identify the specific trip.
// E.g., /travel/ABC123 where 'ABC123' is the tripCode.
router.route("/travel/:tripCode")
.get(tripsController.findTrip)                              // GET  -> fetch one specific trip from DB.travel collection.
.put(authenticateJWT, tripsController.tripsUpdateTrip);     // PUT  -> find and update item from DB.travel collection.

// Export the router object to be used in other parts of the application
module.exports = router;