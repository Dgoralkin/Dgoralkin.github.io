/* ========================================================================================
  File: setup2FA.js
  Description: Controller module for the 2FA TOTP setup page.
  Author: Daniel Gorelkin
  Version: 1.0
  Created: 2025-11-24
  Updated: NA

  Purpose:
    - Render the QR and/or the unique setup code for setting up the TOTP 2FA (user setup page).
    - Reads parameters from the passed message body: String message, QR code and the secret.
=========================================================================================== */

// Controller function to handle requests to the 2fa/setup page for rendering the TOTP QR code.
const renderSetup2FA = (req, res) => {

    try {
        // Read cookie data from the server
        const cookieString  = req.cookies.session2FA;
        if (!cookieString ) throw new Error("No session2FA cookie found");

        // Convert back to object so it could be properly rendered
        const cookie = JSON.parse(cookieString);

        // Render in the .HBS page.
        res.render("setup2FA", {
            title: "Setup 2FA - Travlr",
            message: cookie.message,
            qrCode: cookie.qrCode,
            secret: cookie.secret
        });
    } catch (err) {
        return res.status(400).send("No 2FA setup data");
    }
};


module.exports = {
    renderSetup2FA
};