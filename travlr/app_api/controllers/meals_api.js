/* ========================================================================================
  File: meals_api.js
  Description: Controller for meals-related API endpoints.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-12

  Purpose:
    - This file contains controller methods for handling API requests related to the meals collection.
    - It includes methods for retrieving, meals from the meals collection.
    - Each method interacts with the Mongoose model to perform database operations.
    - Proper error handling and response formatting are implemented.
=========================================================================================== */

// Import the Mongoose model for index collection
const DB_meal = require('../models/mealsSchema');

// ======================================== //
//          *** Methods for GET ***         //
// ======================================== //

// GET: /meals -> Endpoint lists all meals from DB.meal collection.
// Returns JSON array of all meals.
const allMealsList = async (req, res) => {
    try {
        // Query the DB with get all
        const query = await DB_meal.find({}).exec();

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

// GET: /meals:mealName -> Endpoint lists a single meal from DB.meal collection.
// Returns JSON object of a single meal.
const findMeal = async (req, res) => {
    try {
        // Query the DB with get one
        // 'mealName' is passed as a route parameter
        const query = await DB_meal.find({'meal' : req.params.mealName}).exec();

        // If no results found, still return 200 but with a response message
        if (!query || query.length === 0) {
            return res.status(200).json({ message: "No results found" });
        }
        // Otherwise, return 200 OK and a json result
        return res.status(200).json(query[0]);

    } catch (err) {
        console.error("Error retrieving trips:", err);
        return res.status(404).json({ message: "Server error", error: err });
    }
};

// Execute allRoomsList endpoints.
module.exports = {
    allMealsList,
    findMeal
};