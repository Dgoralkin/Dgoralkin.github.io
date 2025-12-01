/* ========================================================================================
  File: registerAndLogin.js
  Description: Controller module for the Register and Login page.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-11-19
  Updated: NA

  Purpose:
    - Render the register and login page for a regular user (not admin registration page).
=========================================================================================== */

// Controller function to handle requests to the register/login page
const register_login = async (req, res, next) => {

res.render("registerAndLogin", {
      title: "Login - Travlr Getaways",
      currentPage: "login"
    });

};

module.exports = { register_login };