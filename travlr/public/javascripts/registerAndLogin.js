/* ====================================================================
  File: registerAndLogin.hbs
  Description: This is the combined, user side registration and login page logic.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-10

  Purpose:
    - Used to register new "customer" users and add the created user account to the database.
    - Used to upgrade guest user account into registered accounts
    - The login method validated that all fields were entered and the username and password are correct.
    - Uses Google's Two Factor Auth to authenticate users via TOTP.
===================================================================== */

// =================================================================================================
// Functions to validate form completeness and correctness to prevent incomplete URI form submission
// =================================================================================================

// Check if any field in the form is empty
function formIsValid(formElement) {
  const inputs = formElement.querySelectorAll("input");

  // Loop through all the input fields.
  for (const input of inputs) {
    if (input.value.trim() === "") {
      return {
        valid: false,
        message: `Field "${input.id}" is required.`,
        field: input.id
      };
    }
  }

  return { valid: true };
}

// Display an error message in an alert view.
function displayError(msg) {
  console.error(msg);
  alert(msg);
}

// Show or hide password in the forms
function showPassword() {
  // Login form
  const loginPassword = document.getElementById("loginPassword");
  loginPassword.type = this.checked ? "text" : "password";
  // Register form
  const regPass = document.getElementById("regPass");
  regPass.type = this.checked ? "text" : "password";
  regPass
}

// Make a call to api/2fa/setup and setup the 2FA 
async function setup2FA(session) {
  try {
    const response = await fetch('/api/2fa/setup', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.token}`
      },
      body: JSON.stringify({ session })
    });

    const data = await response.json();

    return data;

  } catch (err) {
    console.error("setup2FA error:", err);
  }
}

// Make a call to /api/register and register new user via the authenticator 
async function registerNewUser(registerForm) {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Include user details in the body as a JSON object.
      body: JSON.stringify(registerForm)
    });

    // Read response from the controller and display a confirmation message in a pop out window.
    // If server returned an error (status 409), means that a user with same email already exists in DB.
    // Display alert message to acknowledge user and return to login page.
    const result = await response.json();

    // Return status code, and a welcome message via alert message.
    if (response.ok) {
      return {
      ok: response.ok,
      status: response.status,
      message: result.message
    };
    } else {
      // Display an alert message that a user with this email already exist.
      window.alert(result.message || 'Try to register!');
      return }
    
  } 
  catch (err) {
    // Return a fake error-like response to avoid undefined
    console.error("Network or server error:", err);
    return { ok: false, status: 0, json: async () => ({ message: "Network error. Try again later." }) };
  }
}

// Make a call to /api/login and sign in a user if user is registered.
async function loginUser(loginForm) {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Include user details in the body as a JSON object.
      body: JSON.stringify(loginForm),
      credentials: "include"
    });

    // Read response from the controller and display a confirmation message in a pop out window.
    // If server returned an error (status 409), means that a user with same email already exists in DB.
    // Display alert message to acknowledge user and return to login page.
    const result = await response.json();
    

    // Check and see if the user enabled his two factor authentication.
    // If 2FA enabled, unhide the TOTP input form and send a verification request to server controller at api/2fa/verify
    if (result.twoFactorEnabled) {
      
      // Event listener for un-hiding the TOTP form after the email and password submitted.
      // and hiding the login button
      document.querySelector("#totp-header").style.display = "block";
      document.querySelector("#loginBtn").style.display = "none";
      document.querySelector("#recoverPswrd").innerHTML = "";

      // ====================================================================================
      //                                                                                    //
      //                                                                                    //
      //    Functionality for the 2FA form and all of its methods inherited and running     //
      //    directly from the verify2FA.js file as it is reused here and in the             //
      //    2FA TOTP setup page setup2FA.hbs                                                //
      //                                                                                    //
      //    After successful 2FA verification,                                              //
      //    Display alert / acknowledgement message, update the login/logout button,        //
      //    and redirect user to the homepage, e.g., window.location.href = "/login";       //
      //                                                                                    //
      //                                                                                    //
      // ====================================================================================

      // User successfully entered email, password, and the TOTP authentication code.
      return;
    }

    // TwoFactor Is Not Enabled case:
    // Display alert / acknowledgement message and redirect user to the homepage.
    window.alert(result.message || 'Welcome!');

    // Trigger a reload so header updates based on session cookie and trigger the login/logout button change.
    window.location.href = "/login";
    return response;

  } 
  catch (err) {
    // Return a fake error-like response to avoid undefined
    console.error("Network or server error:", err);
    return { ok: false, status: 0, json: async () => ({ message: "Network error. Try again later." }) };
  }
}

// Remove token cookie by contacting backend logout endpoint to sign user out.
async function logoutUser() {
  try {
    // Contact backend via POST
    const response = await fetch('/api/logout', {
      method: 'POST',
      credentials: "include"
    });

    const loggedOut = await response.json();

    // Reload to trigger header refresh
    if (response.ok) {
      window.location.reload();
    }

  } catch (err) {
    console.error("Error signing user out", err);
  }
}


// =========================================================
// LOGIN FORM HANDLER:
// Validates all fields are filled and prepares JSON object.
// =========================================================

// Prevent default form submission and validate form input.
async function handleLogin(event) {

  event.preventDefault();
  const form = document.getElementById("loginForm");

  // Check that all fields are valid.
  const emptyCheck = formIsValid(form);
  if (!emptyCheck.valid) {
    displayError(emptyCheck.message);
    return response;
  }

  // Fetch and trim all input values in a JSON object
  const loginForm = {
    email: document.getElementById("loginEmail").value.trim(),
    password: document.getElementById("loginPassword").value.trim(),
  };

  // Send login request /api/login carrying a body message to sign in existing user..
  const response = await loginUser(loginForm);

  // Return back to the login page if couldn't sign in user because he doesn't exist or password doesn't match.
  if (!response.ok) { return response; }
}


// =========================
// REGISTER FORM HANDLER
// =========================

// Prevent default form submission and validate form input.
// Registers new users and redirects them to the 2FA setup page.
async function handleRegister(event) {

  event.preventDefault();
  const form = document.getElementById("registerForm");

  // Check that all fields are valid.
  const emptyCheck = formIsValid(form);
  if (!emptyCheck.valid) {
    displayError(emptyCheck.message);
    return;
  }

  // Check passwords match or return with an alert message.
  const password1 = document.getElementById("regPass").value.trim();
  const password2 = document.getElementById("regConfirm").value.trim();

  if (password1 !== password2) {
    displayError("Passwords do not match.");
    return;
  }

  // Get unique user ID and user status by checking if session/cookie exist.
  const res = await fetch("/api/checkSession");
  const data = await res.json();
  const user_id = data.user_id;
  const isRegistered = data.isRegistered;

  // Fetch and trim all input values in a JSON object
  const registerForm = {
    user_id: user_id,                       // user registered as a guest
    fName: document.getElementById("firstName").value.trim(),
    lName: document.getElementById("lastName").value.trim(),
    email: document.getElementById("regEmail").value.trim(),
    password: document.getElementById("regPass").value.trim(),
    isRegistered: true,                    // new unregistered user
    isAdmin: false                                 // user role
  };

  // Send register request /api/register carrying a body message to create a new user account.
  const userRegistered = await registerNewUser(registerForm);

  // Return back to the login page if couldn't add new user and create new registered account.
  if (!userRegistered.ok) { return userRegistered; }

  // User account created successfully. Get permission to set up the 2FA auth via a confirmation alert.
  if (confirm(`${userRegistered.message}\nEnable 2-Factor Authentication now?`)) {

    // Set up Online One-Time Password authentication (TOTP). Pass session data.
    const session = await setup2FA(data);

    // Redirect to rendering route
    window.location.href = "/2fa/setup";

  } else {
    alert(result.message);
    return;
  }  
}


// ====================================================================================
// Event listeners to fetch login and register data forms and the show password button.
// ====================================================================================
document.getElementById("loginForm").addEventListener("submit", handleLogin);             // Submit login form
document.getElementById("registerForm").addEventListener("submit", handleRegister);       // Submit register form
document.getElementById("showPassword").addEventListener("change", showPassword);         // Hide/unhide password

// ====================================================================================
// Event listener for the logout button.
// ====================================================================================
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (event) => {
      event.preventDefault();
      logoutUser();
    });
  }
});
