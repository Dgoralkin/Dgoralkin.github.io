/* ========================================================================================
  File: cart_api.js
  Description: Controller for cart API endpoints.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-12

  Purpose:
    - This file contains controller methods for handling API requests related to the travel collection.
    - It includes methods for retrieving, adding, deleting and updating trips, rooms, and meals in the cart collection.
    - Returns a JSON array to the requesting source.
    - Each method interacts with the Mongoose model to perform database operations.
    - The records in the cart are maintained by cookies for unregistered (Guest) users.
    - Data to the controllers passed through cookies and URL parameters for GET methods,
      and through body message for the POST, PUT, and DELETE methods.
    - Implements the Timsort hybrid sorting algorithm with O(n log n) Time Complexity.
=========================================================================================== */

// Import the Mongoose models for Cart, Travel, Rooms, and Meals collection
const DB_Cart = require('../models/cartSchema');
const DB_Travel = require('../models/tripsSchema');
const DB_Rooms = require('../models/roomsSchema');
const DB_Meals = require('../models/mealsSchema');

// Import the Mongoose model
const mongoose = require("mongoose");

// ======================================== //
//          *** Methods for GET ***         //
// ======================================== //

// GET: /cart -> Endpoint lists all various items from DB.cart collection.
// List all the existing items in user's personal cart.
// Returns JSON flatten array of all existing objects in the cart ordered by trip -> room -> meal.
// Expected response format: [{all Travel objects}, {all Room objects}, {all Meals objects}]
const allCartItemsList = async (req, res) => {
    try {
        // Get a unique user Id from the pre-set cookie.
        const cookie = req.cookies.sessionData;
        if (!cookie) {
            return res.status(401).json({ message: "No cookie exist" });
        }
        // Extract user_id from the cookie
        const session = JSON.parse(cookie);
        const user_id = session.user_id;

        // Query the DB with get all items from the cart aggregated by collection.
        const query = await DB_Cart.find({'user_id': user_id}).lean().exec();

        // Define the desired rendering order
        const order = {
        travel: 1,
        rooms: 2,
        meals: 3
        };

        // Sort the results with JavaScript with a Timsort hybrid sorting algorithm. (mix of Merge and Insertion Sort -> O(n log n))
        query.sort((a, b) => {
        return order[a.dbCollection] - order[b.dbCollection];
        });

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

// Function queries the database to find any single object from a given collection
// Returns JSON object of a single item found from any desired collection in the database.
// The query is built dynamically by the passed parameters through the URI. 
// E.g., /cart/colname/itemID123 where 'colname' is the collection name, and 'itemID123' is the item _id.
const findOneCartItem = async (req, res) => {
    try {
        // Read parameters from the URI and extract the collection name and item unique _id to query the database.
        const { dbCollection, itemId } = req.params;

        // Get a unique user Id from the pre-set cookie when user was created
        if (!req.cookies.user_id) { return res.status(401).json({ message: "No user_id found" }); }
        const user_id = req.cookies.user_id;

        // Select the correct DB model dynamically by the parameters from URI
        let DB = null;
        if (dbCollection === "travel") DB = DB_Travel;
        else if (dbCollection === "rooms") DB = DB_Rooms;
        else if (dbCollection === "meals") DB = DB_Meals;

        // Handle case where requested collection is invalid
        if (!DB) {
        return res.status(400).json({ message: `Invalid collection name: ${dbCollection}` });
        }
        
        // Check if Object's _Id is valid and is exactly 24 characters long
        if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).json({ message: `Invalid ObjectId: ${itemId}` });
        }

        // Query selected DB collection with get one to query the specific item by _id.
        const query = await DB.findOne({'user_id':user_id, 'item_id': itemId}).exec();

        // If no results found, still return 200 but with a response message
        if (!query || query.length === 0) {
            return res.status(200).json({ message: "No results found" });
        }
        // Otherwise, return 200 OK and a json result
        return res.status(200).json(query);

    } catch (err) {
        console.error("Error retrieving items from cart:", err);
        return res.status(404).json({ message: "Server error", error: err });
    }
};

// This method triggers with every app load by the DOMContentLoaded listener in index.hbs
// It searches the cart for unpaid abandoned items and removes them if there in the cart for 24H>.
// Returns a JSON response
const clearExpiredSession = async (req, res) => {
  try {

    // Define cut off of 24H from now.
    const now = new Date();
    const cutoff = new Date(now.getTime() - (24 * 60 * 60 * 1000)); // Now - 24H

    // Find all abandoned items in the cart which are older than 24H.
    const expiredItems = await DB_Cart.find({
      addToCartDate: { $lt: cutoff }
    }).lean();

    if (!Array.isArray(expiredItems) || expiredItems.length === 0) {
      return res.status(200).json({ message: "No expired items found" });
    }

    // An array of items by _id to delete from the cart
    const idsToDelete = expiredItems.map(item => item._id);

    // Delete all expired items from cart by _id all at once.
    const deletedItems = await DB_Cart.deleteMany({ _id: { $in: idsToDelete } });

    // Return status.
    return res.status(200).json({ message: "Expired items items deleted", data: deletedItems });
  } catch (err) {
    console.error("Error retrieving expired items:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ======================================== //
//          *** Methods for POST ***        //
// ======================================== //

// Function queries the database to add a single object from the cart collection
// Validates and returns a response message if item already exist in user's cart.
// Returns JSON object of a single item found from the cart collection in the database.
// E.g., /cart where the parameters are passed through a x-www-form-urlencoded message.
const addItemToCart = async (req, res) => {
    try {
        // Get a unique user Id from the browser cookie.
        const cookie = req.cookies.sessionData;
        if (!cookie) {
            return res.status(401).json({ message: "No cookie exist" });
        }
        // Extract user_id from the cookie
        const session = JSON.parse(cookie);
        const user_id = session.user_id;

        // Extract passed object parameters from the message body request.
        const {collection, item_id, itemCode, itemName, itemRate, itemImage} = req.body;

        // Check if the item already exists in the cart for the specific user.
        const existingItem = await DB_Cart.findOne({ user_id: user_id, item_id: item_id }).exec();

        // If found, return an informative 200 OK response and a message
        if (existingItem) {
            return res.status(200).json({ message: `Item "${itemName}" is already in your cart.` });
        }

        // If item does not exist in the cart, create a new item object using the data passed from req.body
        const newCartItem = new DB_Cart({
            user_id: user_id,
            item_id: item_id,
            code: itemCode,
            name: itemName,
            dbCollection: collection,
            rate: itemRate,
            image: itemImage
    });

    // Save the new item to the cart collection in the DB
    const q = await newCartItem.save();

    // Return the newly added trip name
    return res.status(201).json({ message: `Item ${itemName} added to your cart` });

    } catch {
        console.error("Error adding item to cart.");
        return res.status(400).json({ message: "Error adding item to db."});
    }
};

// ======================================== //
//          *** Methods for PUT ***         //
// ======================================== //

// Function queries the database to update a single object from the cart collection
// Returns the updated JSON object of a single item from the cart collection in the database.
// E.g., /cart where the _id parameter and the new quantity value are passed through a x-www-form-urlencoded message.
const updateItemQuantity = async (req, res) => {
    try {
        // Get a unique user Id from the browser cookie.
        const cookie = req.cookies.sessionData;
        if (!cookie) {
            return res.status(401).json({ message: "No cookie exist" });
        }
        // Extract user_id from the cookie
        const session = JSON.parse(cookie);
        const user_id = session.user_id;

        // Find the item by item _id and update its quantity field according to the request in req.body
        // Returns a JSON of the freshly updated record
        const updatedItem = await DB_Cart.findOneAndUpdate(
            { "user_id": user_id, "_id": req.body._id }, 
            { "quantity": req.body.quantity },
            { "new": true, "runValidators": true }  // Run validator to insure minimum quantity limit and return updated document.
        ).exec();

        // Validate that the cart item has been updated with the requested value.
        if (updatedItem !== null) {
            // Return OK and the updated item JSON object
            return res.status(201).json(updatedItem);
        } else {
            // Return 404 and the JSON
            return res.status(404).json(updatedItem);
        }

    // General error handler.
    } catch {
        console.error("Error updating item in cart.");
        return res.status(400).json({ message: "Error updating item in cart."});
    }
};

// ======================================== //
//          *** Methods for DELETE ***      //
// ======================================== //

// Function queries the database to delete a single object from the cart collection
// Returns a JSON confirmation message of removing object from the cart collection in the database.
// E.g., /cart where the user ID, and record _id parameter values are passed through a x-www-form-urlencoded message.
const removeItemFromCart = async (req, res) => {
    try {
        // Get a unique user Id from the browser cookie.
        const cookie = req.cookies.sessionData;
        if (!cookie) {
            return res.status(401).json({ message: "No cookie exist" });
        }
        // Extract user_id from the cookie
        const session = JSON.parse(cookie);
        const user_id = session.user_id;

        // Read parameters from the URI and extract the collection name and item unique _id to query the database.
        const _id = req.body._id;
        
        // Find the item by item _id and delete it from the database according to the request in req.body
        // Returns a JSON of the successfully deleted record
        const removeItem = await DB_Cart.findOneAndDelete({ user_id, _id }).exec();

        // Validate that the cart item has been removed.
        if (!removeItem) {

            // Return 404 and the JSON
            return res.status(404).json({ error: "Item not found" });
        } 

        // Return OK and the updated item JSON object
            return res.status(201).json({ message: "Item removed", removeItem });

    // General error handler.
    } catch {
        console.error("Error deleting item from cart.");
        return res.status(400).json({ message: "Error deleting item from cart."});
    }
};

// Export the controller methods
module.exports = {
    allCartItemsList,           // GET method
    findOneCartItem,            // GET method
    addItemToCart,              // POST method
    updateItemQuantity,         // PUT method
    removeItemFromCart,         // DELETE method
    clearExpiredSession         // DELETE MANY method
};