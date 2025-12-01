/* ========================================================================================
  File: about.js
  Description: Controller module for the About page.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-10

  Purpose:
    - This is the controller module to add navigation functionality for the about 
      page which manage the application logic
    - Read the content from the about.json file @app_server.data and store data as trips.
=========================================================================================== */

// Import the filesystem module to read JSON file
const fs = require('fs');

// Initialize about_data object
let about_data = {};

// Safely read about.json with a try–catch block from the data directory @app_server/data/about.json
try {
    const raw_json = fs.readFileSync('./data/about.json', 'utf8');
    about_data = JSON.parse(raw_json);
} catch (error) {
    console.error("Error reading or parsing about.json:", error.message);
    about_data = {
        content: {
            paragraph_1: "Data unavailable.",
            paragraph_2: "Data unavailable."
        },
        crews: "Data unavailable.",
        amenities: "Data unavailable.",
        community: "Data unavailable.",
        details: "Data unavailable."
    };
}

// Render the about view with the fetched data and with (Response 200 OK)
const about = (req, res) => {
    res.render('about', {title: "About - Travlr Getaways", currentPage: 'about', about_us: about_data});
};

module.exports = {
    about
}