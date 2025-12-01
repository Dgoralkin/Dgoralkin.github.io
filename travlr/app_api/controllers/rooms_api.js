/* ========================================================================================
  File: rooms_api.js
  Description: Controller for rooms-related API endpoints.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-12

  Purpose:
    - This file contains controller methods for handling API requests related to the rooms collection.
    - It includes methods for retrieving, room/s from the rooms collection.
    - Each method interacts with the Mongoose model to perform database operations.
    - Proper error handling and response formatting are implemented.
=========================================================================================== */

// Import the Mongoose model for index collection
const DB_Room = require('../models/roomsSchema');

// ======================================== //
//          *** Methods for GET ***         //
// ======================================== //

// GET: /rooms -> Endpoint lists all rooms from DB.room collection.
// Returns JSON array of all rooms.
const allRoomsList = async (req, res) => {
    try {
        //  Query the DB with get all
        // 'rooms' collection is expected to have a single document with an array of room objects
        const query = await DB_Room.find({}).exec();

        // If no results found, still return 200 but with a response message
        if (!query || query.length === 0) {
            return res.status(200).json({ message: "No results found" });
        }
        // Otherwise, return 200 OK and a json result
        return res.status(200).json(query);

    } catch (err) {
        console.error("Error retrieving trips:", err);
        return res.status(404).json({ message: "Server error", error: err });
    }
};

// GET: /rooms:roomName -> Endpoint lists a single room from DB.room collection.
// Returns JSON object of a single room.
const findRoom = async (req, res) => {
    try {
        // Query the DB with get one
        // 'roomName' is passed as a route parameter
        // E.g., /rooms/Deluxe where 'Deluxe' is the roomName.
        const query = await DB_Room.find({'name' : req.params.roomName}).exec();

        // If no results found, still return 200 but with a response message
        if (!query || query.length === 0) {
            return res.status(200).json({ message: "No results found" });
        }
        // Otherwise, return 200 OK and a json result
        return res.status(200).json(query);

    } catch (err) {
        console.error("Error retrieving trips:", err);
        return res.status(404).json({ message: "Server error", error: err });
    }
};

// Export the controller methods
module.exports = {
    allRoomsList,
    findRoom
};