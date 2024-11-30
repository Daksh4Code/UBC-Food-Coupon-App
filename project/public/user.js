// UNUSED

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
/*
// Adds a new user
async function createUser(event) {
    event.preventDefault();

    const accountId = document.getElementById("accountId").value;
    const year = document.getElementById("year").value;
    const major = document.getElementById("major").value;
    const password = document.getElementById("password").value;
    const sid = document.getElementById("sid").value;
    const cwl = document.getElementById("cwl").value;

    const response = await fetch('/users/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({accountId, year, major, password, sid, cwl})
    });

    const result = await response.json();
    document.getElementById("createUserResult").textContent = result.message;

    document.getElementById("createUserForm").reset();
}

// Fetches and displays all users
async function fetchAndDisplayUsers() {
    try {
        const response = await fetch('/users/view');
        const data = await response.json();
        // Code to display the users data in the UI
        console.log(data); // Placeholder for UI update
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Fetches and displays all account IDs
async function fetchAndDisplayAccountIds() {
    try {
        const response = await fetch('/users/accountIds');
        const data = await response.json();
        // Code to display the account IDs data in the UI
        console.log(data); // Placeholder for UI update
    } catch (error) {
        console.error('Error fetching account IDs:', error);
    }
}

// Initializes the webpage functionalities.
window.onload = function () {
    document.getElementById("createUserForm").addEventListener("submit", createUser);
    fetchAndDisplayUsers();
    fetchAndDisplayAccountIds();
};

*/

