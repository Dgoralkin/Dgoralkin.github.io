/* ===================================================================================
  File: app.js
  Description: Main application file for Travlr CMS
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-10

  Purpose:
    - Sets up Express server with middleware for logging, parsing, and authentication
    - Configures view engine (Handlebars) and static file serving
    - Defines routes for both server-rendered pages and RESTful API endpoints
    - Implements error handling for 404 and other server errors
    - Enables CORS for cross-origin requests from an Angular SPA
    - Connects to MongoDB database
    - Loads environment variables from .env file
    - Registers Handlebars helpers and partials for dynamic content rendering
====================================================================================== */

// Import required modules
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Require MongoDB from the app_api/models folder
require('./app_api/models/db');

// Pull in the contents of our .env file to bring the variables defined in 
// the file into our memory space
require('dotenv').config();


// Setup routes for page navigation
const indexRouter = require('./app_server/routes/index');         // Update the path for the homepage
const travelRouter = require('./app_server/routes/travel');       // Update the path for the travel page
const roomRouter = require('./app_server/routes/rooms');          // Update the path for the room page
const mealsRouter = require('./app_server/routes/meals');         // Update the path for the meals page
const newsRouter = require('./app_server/routes/news');           // Update the path for the news page
const aboutRouter = require('./app_server/routes/about');         // Update the path for the about page
const contactRouter  = require('./app_server/routes/contact');    // Update the path for the contact us page
const cartRouter  = require('./app_server/routes/cart');          // Update the path for the shopping cart page
const userLoginRouter  = require('./app_server/routes/registerAndLogin'); // path for the login and register page
const userSetup2faRouter  = require('./app_server/routes/setup2FA'); // path for the user 2FA setup page

// Setup rest api routes for page navigation
const indexApiRouter = require('./app_api/routes/index_api');         // Path to the index api
const travelApiRouter = require('./app_api/routes/travel_api');       // Path to the travel api
const roomsApiRouter = require('./app_api/routes/rooms_api');         // Path to the rooms api
const mealsApiRouter = require('./app_api/routes/meals_api');         // Path to the meals api
const newsApiRouter = require('./app_api/routes/news_api');           // Path to the news api
const contactUsApiRouter = require('./app_api/routes/contact_api');   // Path to the contact api
const cartApiRouter = require('./app_api/routes/cart_api');           // Path to the contact api
const authRoutes = require("./app_api/routes/authentication");        // Path to the authentication api
const twoAutApiRouter = require("./app_api/routes/setup2FA");                // Path to the 2FA setup api

// Enable handlebars to render in multiple pages
const handlebars = require('hbs');

// Enable helper for handlebars
handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

// Register middleware globally for login/logout functionality
const authStatus = require('./middleware/authStatus');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));    // Update the path for the new app_server dir

// register the call to enable partials handlebars:
handlebars.registerPartials(path.join(__dirname, 'app_server', 'views', 'partials'));
app.set('view engine', 'hbs');

// Setup middleware
app.use(logger('dev'));
app.use(express.json());

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(authStatus);
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS (Cross Origin Resource Sharing) for resource sharing to hook Angular SPA
// Define local and production access points to choose from to allow the Admin app to access the database.
const allowedOrigins = [
  'https://admin-travlr-dg.onrender.com',
  'http://localhost:4200'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Required for preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Catch unauthorized error and create 401
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({"message": err.name + ": " + err.message});
  }
});


// Activate the homepage and all other pages
app.use('/', indexRouter);                  // Go to homepage (index).
app.use('/', travelRouter);                 // Go to the travel page.
app.use('/', roomRouter);                   // Go to the room page.
app.use('/', mealsRouter);                  // Go to the room page.
app.use('/', newsRouter);                   // Go to the news page.
app.use('/', aboutRouter);                  // Go to the about page.
app.use('/', contactRouter);                // Go to the contact us page.
app.use('/', cartRouter);                   // Go to cart page.
app.use('/', userLoginRouter);              // Go to user login page.
app.use('/', userLoginRouter);              // Go to user login page.
app.use('/', userSetup2faRouter);           // Go to user 2FA page.

// Wire-up api routes to controllers
app.use('/api', indexApiRouter);            // Trigger the api for the index homepage from app_api/routes/index_api
app.use('/api', travelApiRouter);           // Trigger the api for the travel page from app_api/routes/travel_api
app.use('/api', roomsApiRouter);            // Trigger the api for the rooms page from app_api/routes/rooms_api
app.use('/api', mealsApiRouter);            // Trigger the api for the meals page from app_api/routes/meals_api
app.use('/api', newsApiRouter);             // Trigger the api for the news page from app_api/routes/news_api
app.use('/api', contactUsApiRouter);        // Trigger the api for the contact us page from app_api/routes/news_api
app.use("/api", cartApiRouter);             // Trigger the api for the cart page from app_api/routes/cart_api
app.use("/api", authRoutes);                // Trigger the api for authentication from app_api/routes/authentication
app.use("/api", twoAutApiRouter);             // Trigger the api for 2FA setup from app_api/routes/2FA

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
