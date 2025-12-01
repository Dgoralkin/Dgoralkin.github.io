/* ========================================================================================
  File: rooms_api.js
  Description: Route module for the Rooms page API.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-11

  Purpose:
    - This file routes the process to the rooms_api.js controller in app_api directory
    - Defines the endpoint `/rooms` and pass the content
        to the 'roomsController.allRoomsList' function.
    - Defines the endpoint `/rooms/:roomName` to find a specific room instance
     and pass the content to the 'roomsController.findRoom' function
=========================================================================================== */

// Import express module and create a router object
const express = require("express");
const router = express.Router();

// Import the rooms controller module
const roomsController = require("../controllers/rooms_api");

// Defines the endpoint '/rooms' and pass the content to the 'roomsController.allRoomsList' function.
// GET method routes lists all rooms from DB.rooms collection
router.route("/rooms").get(roomsController.allRoomsList);

// Defines the endpoint '/rooms/:roomName' and pass the content to the 'roomsController.findRoom' function.
// GET method routes finds one specific room from DB.rooms collection.
// The :roomName is a route parameter used to identify the specific room.
// E.g., /rooms/Deluxe where 'Deluxe' is the roomName.
router.route("/rooms/:roomName").get(roomsController.findRoom);

// Export the router to be used in the main app
module.exports = router;