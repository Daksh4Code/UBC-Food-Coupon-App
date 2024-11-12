/*
 * These functions below are for various user-management related functionalities.
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 *
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your
 *   backend endpoints
 * and
 *   HTML structure.
 *
 */

// Adds a new user
async function createUser(event) {
    event.preventDefault();

    const accountId = document.getElementById("accountId").value;
    const year = document.getElementById("year").value;
    const major = document.getElementById("major").value;
    const password = document.getElementById("password").value;
    const sid = document.getElementById("sid").value;
    const cwl = document.getElementById("cwl").value;

    const response = await fetch('/users/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accountId, year, major, password, sid, cwl })
    });

    const result = await response.json();
    document.getElementById("createUserResult").textContent = result.message;

    // Clear form fields after submission
    document.getElementById("createUserForm").reset();
}

// Logs in a user
async function loginUser(event) {
    event.preventDefault();

    const cwl = document.getElementById("loginCwl").value;
    const password = document.getElementById("loginPassword").value;

    const response = await fetch('/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cwl, password })
    });

    const result = await response.json();
    document.getElementById("loginUserResult").textContent = result.message;

    // Clear form fields after submission
    document.getElementById("loginUserForm").reset();
}

// Updates user's password
async function editUser(event) {
    event.preventDefault();

    const accountId = document.getElementById("editAccountId").value;
    const newPassword = document.getElementById("newPassword").value;

    const response = await fetch(`/users/${accountId}/update-password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPassword })
    });

    const result = await response.json();
    document.getElementById("updatePasswordResult").textContent = result.message;

    // Clear form fields after submission
    document.getElementById("updateUserPasswordForm").reset();
}

// Initializes the webpage functionalities.
window.onload = function() {
    document.getElementById("createUserForm").addEventListener("submit", createUser);
    document.getElementById("loginUserForm").addEventListener("submit", loginUser);
    document.getElementById("updateUserPasswordForm").addEventListener("submit", editUser);
};