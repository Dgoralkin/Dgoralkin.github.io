/* ========================================================================================
  File: contact.js
  Description: Controller module for the Contact page.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-10

  Purpose:
    - This is the controller module to add navigation functionality for the contact 
      page which manage the application logic
    - Read the articles from the database @travlr.contact collection and store data as array.
    - Fetch data from the database through an API endpoint with a fallback option.
=========================================================================================== */

// Build an API URL from environment variable (fallback to localhost) and the /api path.
const apiHost = process.env.API_HOST;
const contactEndpoint = `${apiHost}/api/contact`;

const option = {
  method: "GET",
  headers: { Accept: "application/json" }
};

// Controller function to handle requests to the contact page
const getContactUs = async (req, res, next) => {

  try {
    // Make a GET request to the API endpoint to fetch contact details
    const response = await fetch(contactEndpoint, option);

    // Throw an error if the response has a bad status (404 or 500)
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    // Parse the JSON response to get the contact details array
    let contactDetails = await response.json();

    // Handle cases where no articles are found or unexpected data is returned
    let message = null;
    if (!Array.isArray(contactDetails)) {
      console.error("API returned unexpected data");
      message = "API lookup error";
      contactDetails = [];
    } else if (contactDetails.length === 0) {
      message = "No trips were found in our database.";
    }

    // Render the contact view with the fetched contact details and any message (Response 200 OK)
    res.render("contact", {
      title: "Contact Us - Travlr Getaways",
      currentPage: "contact",
      contact_data: contactDetails[0],
      message
    });
  } catch (err) {
    // Handle any errors that occur during the fetch operation
    console.error(err);
    res.status(500).send(err.message);
  }
};

module.exports = {
    getContactUs
};
