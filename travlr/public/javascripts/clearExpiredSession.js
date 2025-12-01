/* ====================================================================
  File: clearExpiredSession.js
  Description: Logic for cart summary calculation
  Author: Daniel Gorelkin
  Version: 1.0
  Created: 2025-11-19
  Updated: NA

  Purpose:
    - Triggers the method with every app load by the DOMContentLoaded listener in index.hbs
    - It searches the cart through the /api/cart/clearExpiredSession call
      for unpaid abandoned items and removes them if there in the cart for 24H or longer.
      Returns a JSON response.
===================================================================== */

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const expiredSessionResponse = await fetch("/api/cart/clearExpiredSession");
    const result = await expiredSessionResponse.json();
  } catch (err) {
    console.error("Error clearing cart:", err);
  }
});