/* ========================================================================================
  File: trvael_api.js
  Description: Controller for travel-related API endpoints.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-12

  Purpose:
    - This file contains controller methods for handling API requests related to the travel collection.
    - It includes methods for retrieving, adding, and updating trips in the travel collection.
    - Each method interacts with the Mongoose model to perform database operations.
    - Proper error handling and response formatting are implemented.
=========================================================================================== */

// Import the Mongoose model for index collection
const DB_Travel = require('../models/tripsSchema');

// ======================================== //
//          *** Methods for GET ***         //
// ======================================== //

// GET: /travel -> Endpoint lists all trips from DB.travel collection.
// Returns JSON array of all trips in the 'travel' collection.
const allTripsList = async (req, res) => {
    try {
        // Query the DB with get all
        const query = await DB_Travel.find({}).exec();

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

// GET: /trip:tripCode -> Endpoint lists a single trip from DB.trips collection.
// Returns JSON object of a single trip.
const findTrip = async (req, res) => {
    try {
        // Query the DB with get one
        // 'tripCode' is passed as a route parameter
        // E.g., /travel/ABC123 where 'ABC123' is the tripCode.
        const query = await DB_Travel.findOne({'code' : req.params.tripCode}).exec();

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

// ======================================== //
//          *** Methods for POST ***        //
// ======================================== //

// POST: / -> Adds a trip to DB.travel collection.
// Expects JSON object in request body.
const tripsAddTrip = async (req, res) => {
    try {

        // Create a new trip object using the data from req.body
        const newTrip = new DB_Travel({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description,
    });

    // Save the new trip to the DB
    const q = await newTrip.save();

    // Return the newly created trip
    return res.status(201).json(q);

    } catch {
        console.error("Error adding trips:");
        return res.status(400).json({ message: "Error adding trips to db."});
    }
};

// ======================================== //
//          *** Methods for PUT ***         //
// ======================================== //

// PUT: /trips/:tripCode - Find a Trip from the db and updates its fields
// E.g., /travel/ABC123 where 'ABC123' is the tripCode.
// Expects JSON object in request body.
const tripsUpdateTrip = async (req, res) => {

    try {
        // Find the trip by tripCode and update its fields with the data from the passed body.
        const updateTrip = await DB_Travel.findOneAndUpdate(
            {'code' : req.params.tripCode},     // Read parameters from URI.
            {code: req.body.code,               // Read parameters from Body.
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description
            }
        ).exec();

        // Return the updated trip
        return res.status(201).json(updateTrip);

    } catch (err){
        console.error("Error updating trip:");
        return res.status(400).json({ message: "Error updating trip in db.", err});
    }
};

// Export the controller methods
module.exports = {
    allTripsList,       // GET method
    findTrip,           // GET method
    tripsAddTrip,       // POST method
    tripsUpdateTrip     // PUT method
};