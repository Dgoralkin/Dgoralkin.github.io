/* ====================================================================
  File: calculateCartTotal.js
  Description: Logic for cart summary calculation
  Author: Daniel Gorelkin
  Version: 1.0
  Created: 2025-11-17
  Updated: NA

  Purpose:
    - Reads and fetches all items from the cart via the Cart API call
    - Dynamically Calculates item price * quantity in the grandTotal var
    - Dynamically populates the summary table with item's name, price, qty, and the total.
    - Triggered by the DOMContentLoaded on every page load or upon quantity change in updateCatItem.js
===================================================================== */

async function loadCartSummary() {
  try {
    const res = await fetch('/api/cart');
    const cartItems = await res.json();

    const tbody = document.querySelector('#cart-table tbody');
    tbody.innerHTML = '';

    let grandTotal = 0;

    // For every row in the summary table, calculate the sum of item * quantity as grandTotal
    // and populate the html row with data. Update the inner HTML for every row and append as child.
    cartItems.forEach(item => {
      const total = item.rate * item.quantity;
      grandTotal += total;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>$${item.rate.toFixed(2)}</td>
        <td>${item.quantity}</td>
        <td>$${total.toFixed(2)}</td>
      `;
      tbody.appendChild(row);
    });

    document.getElementById('grand-total').textContent = `$${grandTotal.toFixed(2)}`;
  } catch (err) {
    console.error('Failed to load cart:', err);
  }
}

window.addEventListener('DOMContentLoaded', loadCartSummary);