/* ========================================================================================
  File: auth.js
  Description: Middleware interceptor to prevent unauthorized (unregistered) access to a page.
  Author: Daniel Gorelkin
  Version: 1.0
  Created: 2025-11-24
  Updated: 2025-11-26

  Purpose:
    - Prevent unauthorized (unregistered) access to any route on the website
    - Checks the header for the token and validates it.
=========================================================================================== */

// Import required library
const jwt = require("jsonwebtoken");

// Token validator.
// Searches for the short life - 60 seconds long token for the 2FA session.
// Validates token against the user.
module.exports = (req, res, next) => {
    try {
        // Get a unique session Id (short life - 60 seconds) token from the pre-set cookie.
        const session2FA = req.cookies.session2FA;

        // Cookie doesn't exist
        if (!session2FA) {
            return res.status(401).render("registerAndLogin", { message: "Missing token" });
        }

        // Cookie fond, parse and extract token.
        const cookie = JSON.parse(session2FA);

        // Validate the found token and let through.
        req.user = jwt.verify(cookie.token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        // Redirect to the login page if session / token expired after 60 seconds
        return res.status(401).render("registerAndLogin", { message: "Session expired, please log in again." });
    }
};