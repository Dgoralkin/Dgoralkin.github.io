/* ========================================================================================
  File: meals_api.js
  Description: Route module for the Meals page API.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-11

  Purpose:
    - This file routes the process to the meals_api.js controller in app_api directory
    - Defines the endpoint `/meals`  and pass the content
        to the 'mealsController.allMealsList' function.
    - Defines the endpoint `/meals/:mealName` and pass the content
        to the 'mealsController.findMeal' function
=========================================================================================== */

// Import express module and create a router object
const express = require("express");
const router = express.Router();

// Import the meals controller module
const mealsController = require("../controllers/meals_api");

// Defines the endpoint '/meals'  and pass the content to the 'mealsController.allMealsList' function.
// GET method routes lists all meals from DB.meals collection
router.route("/meals").get(mealsController.allMealsList);

// Defines the endpoint '/meals/:mealName' and pass the content to the 'mealsController.findMeal' function.
// GET method routes fetch one specific meal from DB.meals collection
// The :mealName is a route parameter used to identify the specific meal.
// E.g., /meals/Pasta where 'Pasta' is the mealName.
router.route("/meals/:mealName").get(mealsController.findMeal);

// Export the router to be used in the main app
module.exports = router;