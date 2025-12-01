/* ========================================================================================
  File: contact_api.js
  Description: Controller for travel-related API endpoints.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-12

  Purpose:
    - This file contains controller methods for handling API requests related to the contact collection.
    - Each method interacts with the Mongoose model to perform database operations.
    - Proper error handling and response formatting are implemented.
    - The GET method retrieves the company contact us details from the contact collection.
    - The POST method handles form submissions for contact us forms and saves them to the leads collection.
=========================================================================================== */

// Import the Mongoose model for contact collection
const DB_Contact = require('../models/contactSchema');

// Import the Mongoose model for lids collection
const DB_lids = require('../models/lidsSchema');

// ======================================== //
//          *** Methods for GET ***         //
// ======================================== //

// GET: /contact -> Endpoint lists the company contact us details from DB.contact collection.
// Returns JSON array of all contact us details.
const getContactUsForm = async (req, res) => {
    try {
        // Query the DB with get all
        const query = await DB_Contact.find({}).exec();

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
//          *** Methods for POST ***         //
// ======================================== //

// POST: @ /api/contact -> Save the submitted contact us form entry to DB.lids collection.
// Read values through x-www-form-urlencoded body → req.body
const submitContactForm = async (req, res) => {
  try {
    // Fetch values from the submitted form.
    const { name, email, subject, message } = req.body;


    // Validate that all fields are filled.
    if (!name || !email || !subject || !message) {
      // Redirect to the Contact page and attach the response message in the URI as query param -
      // to display the error alert and default code: 302.
      // Note: See public/javascripts/contact.js for handling the alert window on the Contact page.
      return res.redirect(`/contact?msg=${encodeURIComponent(`Fields: name, email, subject, or message cannot be empty!`)}`);
    }

    // Add document to the DB.lids collection.
    const newLid = new DB_lids({
      name,
      email,
      subject,
      message,
      createdAt: new Date()
    });
    
    // Save the lid data to the database.
    await newLid.save();

    // Redirect to the Contact page and attach the response message in the URI as query param.
    // to display the confirmation alert with message in the body and default code: 302.
    // Note: See public/javascripts/contact.js for handling the alert window on the Contact page.
    return res.redirect(`/contact?msg=${encodeURIComponent(`Thank you ${name}, your form submitted successfully`)}`);

  } catch (err) {
    console.error("Error saving contact form:", err);
    return res.status(500).json({ message: "Server error", error: err });
  }
};

// Execute allRoomsList endpoints.
module.exports = {
    getContactUsForm,
    submitContactForm
};