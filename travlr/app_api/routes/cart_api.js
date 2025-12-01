/* ========================================================================================
  File: cart_api.js
  Description: Route module for the Cart page API.
  Author: Daniel Gorelkin
  Version: 1.0
  Created: 2025-11-13
  Updated: NA

  Purpose:
    - This file routes the process to the travel_api.js controller in app_api directory.
    - Defines the endpoint `/travel` and pass the content
        to the 'tripsController.allTripsList' function.
    - Also defines POST method to add a new trip, protected by JWT authentication.
    - Defines the endpoint `/travel/:tripCode` and pass the content
        to the 'tripsController.findTrip' function.
    - Also defines PUT method to update a trip, protected by JWT authentication.
=========================================================================================== */

// Import express module and create a router object
const express = require("express");
const router = express.Router();

// Import the cart controller module
const cartController = require("../controllers/cart_api");

// Defines the endpoint '/cart' and pass the content to the 'cartController.allCartItemsList' function.
// Also defines POST method to add selected item objects to the DB.cart collection through the message body.
router.route("/cart")
.get(cartController.allCartItemsList)           // GET  -> Fetch all items from DB.cart collection.
.post(cartController.addItemToCart)             // POST -> Add item to the user's cart in DB.cart collection.
.put(cartController.updateItemQuantity)         // PUT  -> Find and updates a record in DB.cart collection.
.delete(cartController.removeItemFromCart)      // DELETE> Remove item from the DB.cart collection.

// Defines the endpoint '/cart/clearExpiredSession'. Used to refresh cart at app boot and remove all expired 
// session items from the cart for all users.
router.route("/cart/clearExpiredSession")
.get(cartController.clearExpiredSession)            // GET  -> Fetch all expire item from DB.cart collection.

// Defines the endpoint '/cart/:dbCollection/:itemId' and pass the content to the 'cartController.findOneCartItem' function.
// The :dbCollection is a database collection name parameter used to search the specific collection from the DB.
// The :itemId is unique object _id parameter used to search the specific item from a collection.
// E.g., /cart/colname/itemID123 where 'colname' is the collection name, and 'itemID123' is the item _id.
router.route("/cart/:dbCollection/:itemId")
.get(cartController.findOneCartItem)            // GET  -> Fetch one specific item from any DB collection.

// Export the router object to be used in other parts of the application
module.exports = router;