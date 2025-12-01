/* ========================================================================================
  File: twoFactorAuth.js
  Description: Controller for user Two-Factor authentication setup.
  Author: Daniel Gorelkin
  Version: 1.0
  Created: 2025-11-24
  Updated: 

  Purpose:
    - This is the controller for authenticating users with the second authentication layer.
    - Defines the API endpoint for setting up the Time-based One Time Password (TOTP) by Google.
    - Generates a base32 secret key to setup the 2FA.
    - Generates a unique QR code to render on the 2FA/setup page.
    - Sets a short term cookie to be parsed by the browser controller.
    - Returns a message, secret, and the QR code.
    - Verifies the returned unique six digit code from user.
    - Updates session cookie and user instance in the database.
    - Returns 200 OK or 401 response.
=========================================================================================== */

// Import required modules
// Methods to set 2FA, and validate users via TOTP
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

// Import the Mongoose models for the Cart and User collections in the database.
const DB_User = require('../models/user');


// Define the route for POST /api/auth/2fa/setup
// Setup the Two Factor Authentication
const setup2FA = async (req, res) => {
    try {
        // Get a unique user Id from the pre-set sessionData cookie.
        const cookie = req.cookies.sessionData;
        if (!cookie) {
            return res.status(401).json({ message: "No cookie exist" });
        }
        // Extract user_id from the cookie
        const session = JSON.parse(cookie);
        const user_id = session.user_id;

        // Look up user in the database.
        const user = await DB_User.findById(user_id);

        // Generate secret key for the TOTP authenticator
        const secret = speakeasy.generateSecret({
            name: `Travlr-(${user.email})`,
            length: 32
        });

        // Update user schema and store the secret
        user.twoFactorSecret = secret.base32;
        await user.save();

        // Generate the QR code
        const qrCode = await QRCode.toDataURL(secret.otpauth_url);
        
        // Set up short term cookie template.
        const session2FA = {
            token: session.token,
            message: "Scan QR code with Google Authenticator",
            qrCode: qrCode,             // The QR code image
            secret: secret.base32       // The TOTP secret
        }

        // Store 2FA session in secure HttpOnly cookie.
        // Define short term 60 seconds lond cookie for the authenticator.
        // Data from the cookie will be used in setup2FA browser controller to render data to HBS page.
        res.cookie("session2FA", JSON.stringify(session2FA), {
            httpOnly: true,                  // Browser JS cannot read it
            secure: true,                    // true if using HTTPS
            sameSite: "Lax",
            path: "/2fa/setup",
            maxAge: 1000 * 60  // expires 1 minute
        });

        // Return
        return res.status(200).json({
            token: session.token,
            message: "Scan QR code with Google Authenticator",
            qrCode: qrCode,             // The QR code image
            secret: secret.base32       // The TOTP secret
        });
    } catch (err) {
        res.status(500).json({ message: "Error creating 2FA setup" });
    }
};

// Verify the returned 2FA code from user.
// Update session cookie and user instance in the database.
// Mark user as registered and authenticated.
const verify2FA = async (req, res) => {

    try {
        // Read cookie data from the server
        const raw_cookie = req.cookies.sessionData;

        // No cookie found, return session false.
        if (!raw_cookie) {
            return res.status(401).json({
                hasSession: false,
                message: "No cookie found."
            });
        }

        // Decode + parse cookie
        const cookie = JSON.parse(decodeURIComponent(raw_cookie));
        
        // Get user instance from the database.
        const user = await DB_User.findById(cookie.user_id);

        // Validate the 2FA code from the user.
        const isValid = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: "base32",
            token: req.body.authCode,
            window: 1
        });

        if (!isValid) { return res.status(400).json({ message: "Not quiet! Check your authentication app and try again..." }); }

        // Update user object values if code is valid.
        user.twoFactorEnabled = true;
        user.isRegistered = true;
        await user.save();

        // Update the session cookie.
        const updatedCookie = JSON.parse(raw_cookie);
        updatedCookie.isAuthenticated = true;
        updatedCookie.isLoggedIn = true;

        // Reset cookie with new values.
        res.cookie("sessionData", JSON.stringify(updatedCookie), {
            httpOnly: true,
            secure: true,
            sameSite: "Lax",
            path: "/",
            maxAge: 1000 * 60 * 60 * 24 * 1,
        });

        const message = {
            status: "2FA verified successfully!",
            userFname: user.fName,
            userLname: user.lName,
        }

        // Return 200 Ok response.
        return res.status(200).json({ updatedCookie, message });
        
    } catch (err) {
        console.error("Error in verify2FA, can't verify user.", err);
    }
};


// Export the controller methods
module.exports = {
    setup2FA,
    verify2FA
};