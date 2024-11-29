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

    // Always clear old, already fetched data before new fetching process.
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

    // Refresh the table data
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

    // Refresh the table data
    fetchFeedbackTable();
}

document.addEventListener('DOMContentLoaded', () => {
    const getBestRatedBranchBtn = document.getElementById('getBestRatedBranchBtn');
    getBestRatedBranchBtn.addEventListener('click', getBestRatedBranch);
});


async function getBestRatedBranch() {
    try {
        const response = await fetch('/feedbacks/best-rated-branch');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const bestRatedBranchTable = document.getElementById('bestRatedBranchTable').getElementsByTagName('tbody')[0];
        bestRatedBranchTable.innerHTML = '';


        if (data.data && data.data.length > 0) {
            data.data.forEach(branch => {
                const row = bestRatedBranchTable.insertRow();
                const branchIdCell = row.insertCell();
                // Ensure branch.BRANCH_ID is correctly extracted (might be nested)
                branchIdCell.textContent = branch.BRANCH_ID || branch.branch_id || branch[0];
            });
        } else {
            const row = bestRatedBranchTable.insertRow();
            const noBranchCell = row.insertCell();
            noBranchCell.textContent = "No best-rated branch found.";
        }
    } catch (error) {
        console.error('Error fetching best-rated branch:', error);
        document.getElementById("bestRatedBranchResult").textContent = "Error fetching best-rated branch.";
    }
}

// Displays feedback for a specific account
async function viewFeedback(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const accountId = document.getElementById("viewAccountId").value;

    try {
        const response = await fetch(`/feedbacks/view/${accountId}`);
        const result = await response.json();

        const feedbacks = result.data;
        const tableElement = document.getElementById('viewFeedbackTable'); // Use a separate table with id="viewFeedbackTable"
        const tableBody = tableElement.querySelector('tbody');

        // Clear existing table data
        if (tableBody) {
            tableBody.innerHTML = '';
        }

        if (feedbacks.length === 0) {
            const row = tableBody.insertRow();
            const cell = row.insertCell();
            cell.textContent = "No feedback found for this account.";
            return;
        }

        feedbacks.forEach(feedback => {
            const row = tableBody.insertRow();
            Object.values(feedback).forEach((field, index) => {
                const cell = row.insertCell(index);
                cell.textContent = field;
            });
        });
    } catch (error) {
        console.error('Error viewing feedback:', error);
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

// Initializes the webpage functionalities.
window.onload = function() {
    fetchFeedbackTable();
    document.getElementById("addFeedbackForm").addEventListener("submit", addFeedback);
    document.getElementById("updateFeedbackForm").addEventListener("submit", updateFeedback);
    document.getElementById("getBestRatedBranchBtn").addEventListener("click", getBestRatedBranch);
    document.getElementById("deleteFeedbackForm").addEventListener("submit", deleteFeedback);
    document.getElementById("viewFeedbackForm").addEventListener("submit", viewFeedback); // Assuming you have a form with id="viewFeedbackForm"
};

// General function to refresh the displayed table data.
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchFeedbackTable();
}