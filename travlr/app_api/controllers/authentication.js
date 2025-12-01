/* ========================================================================================
  File: contact_api.js
  Description: Controller for user authentication and registration.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-12

  Purpose:
    - This is the controller for authenticating and registering users.
    - It includes methods for user registration, login, and JWT authentication middleware.
    - Supports authenticating and setting token for both guest and regular website users.
    - Contain method for setting up a session for guest user and updating session from guest
      to registered user session to maintain cart items and records.
    - Contain method to check retrieve cookies data and check session details.
=========================================================================================== */

// Import required modules
// Methods to set JWT, register and validate user password
const jwt = require("jsonwebtoken");
const User = require("../models/user");
// Import the Mongoose models for the Cart and User collections in the database.
const DB_Cart = require('../models/cartSchema');
const DB_User = require('../models/user');


// ======================================== //
//       *** Helper functions ***           //
// ======================================== //

const setTokenAndCookie = (user, user_id, res) => {
    // Generate and set unique token for the registered user.
    const token = user.generateJWT();

    // Update cookie -> build session object for a cookie. Mark user as "register", and not Authenticated yet.
    const session = {
        token,
        hasSession: true,
        user_id: user_id,
        isGuest: false,
        isRegistered: true,
        isLoggedIn: false,
        isAuthenticated: false
    };

    // Store session in secure HttpOnly cookie to prevent Cross-Site Scripting (XSS) attacks for one day.
    res.cookie("sessionData", JSON.stringify(session), {
        httpOnly: true,                  // Browser JS cannot read it
        secure: true,                    // true if using HTTPS
        sameSite: "Lax",
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 1  // expires in 1 days
    });

    return token;
}

// ======================================== //
//       *** Authentication Methods ***     //
// ======================================== //

// Register new user controller
// Validates user input, creates a registered user account, hashes password, sets cookie and session. 
// Returns token and a welcome message to be shown in an alert window with user name and last name.
// Handles swapping a session from a "guest" to "registered" user status in the session.
// Updates the set cookie, and transfer all cart belongings from a "guest" to "registered" user status.
const register = async (req, res) => {

    // Validate required user fields received from the form, else return error message
    // Reads the passed body message for: first name, email, and password.
    if (!req.body.fName || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: "All fields required" });
    }

    // Create new user object from User model schema. Data fetched from request body.
    try {
        const user = new User({
            fName: req.body.fName,                  // first name
            lName: req.body.lName,                  // last name
            email: req.body.email,                  // email
            isRegistered: req.body.isRegistered,    // guest or registered user
            isAdmin: req.body.isAdmin               // admin or user role
        });

        // Salt and hash the password using setPassword method from User model and update user object.
        user.setPassword(req.body.password);

        // Try to add user to the database.users collection while checking if a user 
        // with the same email already exist. Return a 409 error and a confirmation message
        // to acknowledge user.
        try {
            await user.save();
        } catch (err) {
            // Duplicate email handling case. A user with the existing email already exist in the database.
            if (err.code === 11000) {
                return res.status(409).json({
                    message: "A user with this email already exists."
                });
            }
        }
        
        // Request cookie data from the server and check if a cookie exist and session set
        // Used to identify if a user is "guest" or trying to register without having previous session.
        const cookie = req.cookies?.sessionData;
        if (!cookie) {

            // Call internal helper function to sign a token and set a session cookie.
            // Passing an existing user instance and the existing user id to be set.
            const token = setTokenAndCookie(user, user._id, res);
            
            // Return and proceed to login or to the second verification step.
            // Prepare text to be displayed in a alert window.
            return res.status(200).json({ token, message: `Welcome ${user.fName} ${user.lName}!
                \nYou will be redirected to set up a Two Step Authentication login!` });
        }

        // Session exist, user has "guest" session and his cart must be migrated to his new "registered" account.
        const oldSession = JSON.parse(cookie);
        const guestUser_id = oldSession.user_id;
        const newUser_id = user._id;

        // Collect user details from a message body to update the created permanent user.
        const isRegistered = req.body.isRegistered;

        // Handle a guest to -> registered user scenario session upgrade.
        // If a call comes while carrying guest user id, and the user is not registered yet to the website.
        if (guestUser_id && isRegistered) {
            try {
                // Update all guest records/items in the cart by updating them with the freshly registered user id.
                const updatedCartItems = await DB_Cart.updateMany(
                    { user_id: guestUser_id },        // find guest's cart items
                    { $set: { user_id: newUser_id }}  // assign to new user
                );

                const updateUserStatus = await DB_User.findOneAndUpdate(
                    { _id: newUser_id },
                    { $set: { isRegistered: true } },
                    { new: true }
                );

                // Delete guestUser_id from database as all his cart items were transferred to the newUser_id.
                const removeGuestUser = await DB_User.findOneAndDelete({ _id: guestUser_id }).exec();

            } catch (err) {
                console.error("Update cart owner error:", err);
                return res.status(500).json({ message: "Failed to update cart owner." });
            }
        }

        // Call internal helper function to sign a token and set a session cookie.
        // Passing an existing user instance and the new user id to be updated.
        const token = setTokenAndCookie(user, newUser_id, res);

        // Return and proceed to login or to the second verification step.
        // Prepare text to be displayed in a alert window.
        return res.status(200).json({ token, message: `Welcome ${user.fName} ${user.lName}!
            \nYou will be redirected to set up a Two Step Authentication login!` });

    } catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({
            message: "Failed to register user."
        });
    }
};


// Login existing (registered) user controller
// Validates user credentials sets a token and stores it in a cookie session "sessionData".
// Returns alert message.
const login = async (req, res) => {
    // Check that all fields are in place, else return error message
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: "All fields required" });
    }

    try {
        // Query the database for the user by email to validate credentials.
        const user = await User.findOne({ email: req.body.email });

        // Check credentials and validate password (returns True if Hash matches)
        if (!user || !user.validPassword(req.body.password)) {
            // No Hash matched -> invalid credentials (can't sign in), return to login page and notify.
            return res.status(401).json({ message: "Invalid credentials. Check your username/password or register!" });
        }

        // Generate a JSON Web Token for the user for 1H if credentials are valid and return token.
        const token = user.generateJWT();
        
        // Check if user has a valid 2FA
        const twoFactorEnabled = user.twoFactorEnabled

        // Define which type of user is logged in.
        function twoFactorStepRequired(twoFactorEnabled) {
            if (!twoFactorEnabled) { return true; }
            return false;
        }

        // Store the token in a cookie so authStatus could read it and update the login/logout button.
        res.cookie("sessionData", JSON.stringify({
            token,
            hasSession: true,
            user_id: user._id,
            isGuest: false,
            isRegistered: true,
            isLoggedIn: twoFactorStepRequired(twoFactorEnabled),
            isAuthenticated: twoFactorEnabled
        }), {
            httpOnly: true,
            secure: true,
            sameSite: "Lax",
            path: "/",
            maxAge: 1000 * 60 * 60 * 24 // 1 day
        });

        // Return status 200/OK
        return res.status(200).json({ token, twoFactorEnabled, message: `Welcome ${user.fName} ${user.lName}!` });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


// Logout signed in user controller. Signs user out.
const logout = async (req, res) => {
    try {
        // Reset cookie and return a logout message.
        res.clearCookie("sessionData", {
            httpOnly: true,
            secure: true,
            sameSite: "Lax",
            path: "/",
        });
        res.status(200).json({ message: "Logged out" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


// Helper function for authenticateJWT. Safely checks if a token exist in the header.
const verifyToken = (token) => {
    if (!token) return { valid: false, message: "No token provided" };

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { valid: true, decoded };
    } catch (err) {
        return { valid: false, message: "Invalid or expired token" };
    }
};


// JWT authentication middleware - sits between the client’s request and the route handler.
// Called by Express automatically before running the route logic where authentication is needed.
const authenticateJWT = (req, res, next) => {

    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    // Call the helper function to decode the token.
    const { valid, decoded, message } = verifyToken(token);

    if (!valid) return res.status(401).json({ message });

    req.user = decoded;
    next();
};


// Creates a temporary user account for "guest" users managed by unique user _id.
// Create a signed session token for the guest user to be stored in a cookie.
// Return the new guest user object and session details.
const registerGuest = async (req, res) => {
    
    try {
        // Create new user object from User model
        const guestUser = new User();

        // Save the guest user to the database
        await guestUser.save();

        // Generate a unique token for guest User.
        const token = guestUser.generateJWT();
        
        // Build session object for a cookie
        const session = {
            token,
            hasSession: true,
            user_id: guestUser._id,
            isGuest: true,
            isRegistered: false,
            isLoggedIn: false,
            isAuthenticated: false
        };

        // Store session in secure HttpOnly cookie
        res.cookie("sessionData", JSON.stringify(session), {
            httpOnly: true,                  // Browser JS cannot read it
            secure: true,                    // true if using HTTPS
            sameSite: "Lax",
            path: "/",
            maxAge: 1000 * 60 * 60 * 24 * 1  // expires 1 days
        });

        // Return user and token to the frontend if needed
         return res.status(200).json({ guestUser });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


// Defines the endpoint for 'api/checkSession', for client side calls checking if a session exist.
// Returns JSON with session details or response error.
const checkSession = async (req, res) => {
    try {
        // Read cookie data from the server
        const cookie = req.cookies.sessionData;

        // No cookie found, return session false.
        if (!cookie) {
            return res.status(200).json({
                hasSession: false,
                session: {
                user_id: "",
                isRegistered: false,
                isAuthenticated: false
            }
            });
        }

        // Parse cookie
        let session = JSON.parse(cookie);

        // Decode the token without verifying
        const decoded = jwt.decode(session.token);

        // Return a safe subset (without the token)
        return res.status(200).json({
            token: session.token,
            hasSession: true,
            user_id: session._id,
            isGuest: session.isGuest,
            isRegistered: session.isRegistered,
            isAuthenticated: session.isAuthenticated
        });

    } catch (err) {
        console.error("Error retrieving session:", err);
        return res.status(500).json({ 
            hasSession: false,
            message: "Error retrieving session",
            error: err 
        });
    }
};


// Export the controller methods
module.exports = {
    register,
    login,
    logout,
    authenticateJWT,
    registerGuest,
    checkSession
};
