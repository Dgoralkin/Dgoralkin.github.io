/* ========================================================================================
  File: authStatus.js
  Description: Route module for the Travel page API.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-11-22
  Updated: NA

  Purpose:
    - This file fetch a cookie upon every page load to manage the login/logout button logic.
    - It parses the session and read the type of user (guest/registered) to update the login/logout button.
    - Used to populate cookie across all pages by the header.hbs script. 
=========================================================================================== */

module.exports = function authStatus(req, res, next) {
  // Get session data from the "sessionData" cookie.
  const sessionCookie = req.cookies.sessionData;

  let isLoggedIn = false;

  // If cookie set, parse and reset global values.
  if (sessionCookie) {
    try {
      const session = JSON.parse(sessionCookie);
      // user logged in if a valid token exists in the session
      isLoggedIn = session.isLoggedIn;
    } catch (err) {
      console.error("Invalid session cookie", err);
    }
  }

  // Update variables in the session.
  res.locals.isLoggedIn = isLoggedIn;
  next();
};