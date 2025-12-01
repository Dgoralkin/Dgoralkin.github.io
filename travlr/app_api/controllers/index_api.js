/* ========================================================================================
  File: index_api.js
  Description: Controller for index-related API endpoints.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-12

  Purpose:
    - This file contains controller methods for handling API requests related to the index collection.
    - It includes methods for retrieving all articles from the index collection.
    - Each method interacts with the Mongoose model to perform database operations.
    - Proper error handling and response formatting are implemented.
=========================================================================================== */

// Import the Mongoose model for index collection
const DB_Index = require('../models/indexSchema');

// ======================================== //
//          *** Methods for GET ***         //
// ======================================== //

// GET: / -> Endpoint lists all articles from DB.index collection.
// Returns JSON array of all articles.
const allArticlesList = async (req, res) => {
    try {
        // Query the index collection for all documents
        const query = await DB_Index.find({}).exec();

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
    allArticlesList
};
