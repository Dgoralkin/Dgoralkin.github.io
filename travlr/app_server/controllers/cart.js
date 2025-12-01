/* ========================================================================================
  File: cart.js
  Description: Controller module for rendering the Shopping Cart page.
  Author: Daniel Gorelkin
  Version: 1.0
  Created: 2025-11-13
  Updated: NA

  Purpose:
    - This is the controller module to add navigation functionality for the cart 
      page which manage the application logic
    - Fetch data from the database @travlr.cart collection through an API endpoint with a fallback option.
    - Render the cart view with the fetched data or show an empty cart page if no data is found.
=========================================================================================== */

// Build an API URL from environment variable (fallback to localhost) and the /api path.
const apiHost = process.env.API_HOST;
const CartEndpoint = `${apiHost}/api/cart`;


// Controller function to handle requests to the cart page
const showCart = async function (req, res, next) {
    
    // Get the cookie from incoming request from the browser and attach it to the call.
    const sessionCookie = req.cookies.sessionData;

    const options = {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    };

    // ONLY attach cookie if it exists
    if (sessionCookie) {
        options.headers.Cookie = `sessionData=${encodeURIComponent(sessionCookie)}`;
    }

    // Make a GET request to the API endpoint to fetch items
    await fetch(CartEndpoint, options)
    .then((res) => res.json())
    .then(json => {

        // Define an empty message response variable
        let message = null;

        // Validate that the response is an array
        // Handle cases where response is OK but no trips are found
        // Return an empty JSON if no trips were found in the database.
        if (!Array.isArray(json)) {
            json = {}
            message = "No trips were found in the database.";
        }

        // Render the cart page view with the fetched items in the cart and a message (Response 200 OK)
        // Return an empty JSON if cart is empty.
        res.render(
            'cart', {
                title: "Shopping Cart - Travlr Getaways", 
                currentPage: 'cart', 
                cartItems: json, 
                message
        });
    })

    // Catch and handle any errors that occur during the fetch operation
    .catch((err) => res.status(500).send(err.message));
};

// Export the module
module.exports = {
    showCart
}