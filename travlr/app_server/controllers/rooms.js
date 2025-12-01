/* ========================================================================================
  File: rooms.js
  Description: Controller module for the Rooms page.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-10

  Purpose:
    - This is the controller module to add navigation functionality for the rooms 
      page which manage the application logic
    - Read the articles from the database @travlr.room collection and store data as array.
    - Fetch data from the database through an API endpoint with a fallback option.
=========================================================================================== */

// Build an API URL from environment variable (fallback to localhost) and the /api path.
const apiHost = process.env.API_HOST;
const roomsEndpoint = `${apiHost}/api/rooms`;

const options = {
  method: "GET",
  headers: { Accept: "application/json" }
};

// Controller function to handle requests to the rooms page
const rooms = async (req, res, next) => {

  try {
    // Make a GET request to the API endpoint to fetch articles
    const response = await fetch(roomsEndpoint, options);

    // Throw an error if the response has a bad status (404 or 500)
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    // Parse the JSON response to get the articles array
    let allRooms = await response.json();

    // Handle cases where no articles are found or unexpected data is returned
    let message = null;
    if (!Array.isArray(allRooms)) {
      console.error("API returned unexpected data");
      message = "API lookup error";
      allRooms = [];
    } else if (allRooms.length === 0) {
      message = "No trips were found in our database.";
    }

    // Render the rooms view with the fetched articles and any message (Response 200 OK)
    res.render("rooms", {
      title: "Rooms - Travlr Getaways",
      currentPage: "rooms",
      rooms_data: allRooms,
      message
    });
  } catch (err) {
    // Handle any errors that occur during the fetch operation
    console.error(err);
    res.status(500).send(err.message);
  }
};

module.exports = { rooms };