/* ========================================================================================
  File: travel.js
  Description: Controller module for the Travel page.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-10

  Purpose:
    - This is the controller module to add navigation functionality for the travel 
      page which manage the application logic
    - Read the articles from the database @travlr.travel collection and store data as array.
    - Fetch data from the database through an API endpoint with a fallback option.
=========================================================================================== */

// Build an API URL from environment variable (fallback to localhost) and the /api path.
const apiHost = process.env.API_HOST;
const tripsEndpoint = `${apiHost}/api/travel`;

const options = {
    method: "GET",
    headers: {Accept: "application/json"}
}

// Controller function to handle requests to the travel page
const travel = async function (req, res, next) {

    // Make a GET request to the API endpoint to fetch trips
    await fetch(tripsEndpoint, options)
    .then((res) => res.json())
    .then(json => {
        let message = null;

        // Handle cases where no trips are found or unexpected data is returned
        if (!(json instanceof Array)) {
            message = "API lookup error";
            json = [];
        } else {
            // Check for empty array
            if (!(json.length)) {
                message = "No trips were found in the database.";
            }
        }

        // Render the travel view with the fetched trips and any message (Response 200 OK)
        res.render(
            'travel', {
                title: "Travel - Travlr Getaways", 
                currentPage: 'travel', 
                trips: json, 
                message
            });
    })

    // Catch and handle any errors that occur during the fetch operation
    .catch((err) => res.status(500).send(err.message));
};

module.exports = {
    travel
}