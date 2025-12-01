/* ====================================================================
  File: contact.js
  Description: Client-side JavaScript for managing the contact page.
  Author: Daniel Gorelkin
  Version: 1.0
  Created: 2025-11-13
  Updated: NA

  Purpose:
    - This file contains JavaScript code that runs in the browser to  
      read the passed massage from the URI and pop up an alert message
    - Used to catch the redirect from the submitted form on the Contact page.
===================================================================== */

// Read query parameter from URI.
const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');

// Show alert if message exists.
if (msg) {
    alert(msg);
}