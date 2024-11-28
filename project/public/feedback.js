/*
 * These functions below are for various webpage functionalities.
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

// Fetches feedback data from the initialized tables and displays it.
async function fetchFeedbackTable() {
    const tableElement = document.getElementById('feedbackTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/feedbacks', {
        method: 'GET'
    });

    const responseData = await response.json();
    const feedbacks = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    feedbacks.forEach(feedback => {
        const row = tableBody.insertRow();
        Object.values(feedback).forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Adds new feedback
async function addFeedback(event) {
    event.preventDefault();

    const accountId = document.getElementById("accountId").value;
    const sid = document.getElementById("sid").value;
    const orderDate = document.getElementById("orderDate").value;
    const branchId = document.getElementById("branchId").value;
    const rating = document.getElementById("rating").value;

    const response = await fetch('/feedbacks/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accountId, sid, orderDate, branchId, rating })
    });

    const result = await response.json();
    document.getElementById("addFeedbackResult").textContent = result.message;

    fetchFeedbackTable();
}

// Updates feedback rating
async function updateFeedback(event) {
    event.preventDefault();

    const accountId = document.getElementById("editAccountId").value;
    const sid = document.getElementById("editSid").value;
    const orderDate = document.getElementById("editOrderDate").value;
    const branchId = document.getElementById("editBranchId").value;
    const newRating = document.getElementById("newRating").value;

    const response = await fetch('/feedbacks/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accountId, sid, orderDate, branchId, newRating })
    });

    const result = await response.json();
    document.getElementById("updateFeedbackResult").textContent = result.message;

    fetchFeedbackTable();
}

// Gets best-rated branch
async function getBestRatedBranch() {
    const response = await fetch('/feedbacks/best-rated-branch', {
        method: 'GET'
    });

    const result = await response.json();
    if (result.data && result.data.length > 0) {
        document.getElementById("bestRatedBranchResult").textContent = `Best Rated Branch ID: ${result.data[0].BRANCH_ID}`;
    } else {
        document.getElementById("bestRatedBranchResult").textContent = "No best-rated branch found.";
    }
}

// Deletes feedback
async function deleteFeedback(event) {
    event.preventDefault();

    const accountId = document.getElementById("deleteAccountId").value;
    const sid = document.getElementById("deleteSid").value;
    const orderDate = document.getElementById("deleteOrderDate").value;
    const branchId = document.getElementById("deleteBranchId").value;

    const response = await fetch('/feedbacks/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accountId, sid, orderDate, branchId })
    });

    const result = await response.json();
    document.getElementById("deleteFeedbackResult").textContent = result.message;

    fetchTableData();
}

// Gets restaurants by address
async function getRestaurantsByAddress(event) {
    event.preventDefault();

    const inputAddress = document.getElementById("inputAddress").value;

    const response = await fetch(`/restaurants/by-address?address=${inputAddress}`);
    const result = await response.json();

    document.getElementById("getRestaurantsByAddressResult").textContent = result.data.join(", ");
}

// Initializes the webpage functionalities.
window.onload = function() {
    fetchFeedbackTable();
    document.getElementById("addFeedbackForm").addEventListener("submit", addFeedback);
    document.getElementById("updateFeedbackForm").addEventListener("submit", updateFeedback);
    document.getElementById("getBestRatedBranchBtn").addEventListener("click", getBestRatedBranch);
    document.getElementById("deleteFeedbackForm").addEventListener("submit", deleteFeedback);
    document.getElementById("getRestaurantsByAddressForm").addEventListener("submit", getRestaurantsByAddress);
};

// General function to refresh the displayed table data..
function fetchTableData() {
    fetchFeedbackTable();
}