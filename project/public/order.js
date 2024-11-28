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


// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('orders/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
        .then((text) => {
            statusElem.textContent = text;
        })
        .catch((error) => {
            statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
        });
}

// // Fetches data from the demotable and displays it.
// async function fetchAndDisplayUsers() {
//     const tableElement = document.getElementById('demotable');
//     const tableBody = tableElement.querySelector('tbody');

//     const response = await fetch('orders/demotable', {
//         method: 'GET'
//     });

//     const responseData = await response.json();
//     const demotableContent = responseData.data;

//     // Always clear old, already fetched data before new fetching process.
//     if (tableBody) {
//         tableBody.innerHTML = '';
//     }

//     demotableContent.forEach(user => {
//         const row = tableBody.insertRow();
//         user.forEach((field, index) => {
//             const cell = row.insertCell(index);
//             cell.textContent = field;
//         });
//     });
// }
// this function was inspired by the sample project fetchAndDisplayUsers function
async function fetchAndDisplayROTDVisitors() {
    const tableElement = document.getElementById('rotd');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('orders/rotd', {
        method: 'GET'
    });

    const responseData = await response.json();
    console.log(responseData)
    const divisTable = responseData.result;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    divisTable.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// This function resets or initializes the demotable.
async function resetDemotable() {
    const response = await fetch("orders/initiate-demotable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "demotable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

// Inserts new records into the demotable.
async function insertDemotable(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertId').value;
    const nameValue = document.getElementById('insertName').value;

    const response = await fetch('orders/insert-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            name: nameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

// Updates names in the demotable.
async function updateNameDemotable(event) {
    event.preventDefault();

    const oldNameValue = document.getElementById('updateOldName').value;
    const newNameValue = document.getElementById('updateNewName').value;

    const response = await fetch('orders/update-name-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldName: oldNameValue,
            newName: newNameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateNameResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Name updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating name!";
    }
}

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countDemotable() {
    const response = await fetch("orders/count-demotable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
    } else {
        alert("Error in count demotable!");
    }
}

// this function was inspired by the sample project fetchAndDisplayUsers function
async function getCosts() {
    const tableElement = document.getElementById('costs');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('orders/costs', {
        method: 'GET'
    });

    console.log(response)

    const responseData = await response.json();
    console.log(responseData)
    const aggTable = responseData.result;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    aggTable.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// this function was inspired by the sample project fetchAndDisplayUsers function
async function fetchROTDData() {
    const tableElement = document.getElementById('rotdName');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('orders/rotdnames', {
        method: 'GET'
    });

    console.log(response)

    const responseData = await response.json();
    console.log(responseData)
    const aggTable = responseData.result;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    aggTable.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}




//FUNCTIONALITY FOR ORDER:

//get all restaurants
async function getRestaurants() {
    try {
        const response = await fetch('/coupons/get_restaurants', {
            method: "GET"
        });
        const responseData = await response.json();
        const restaurants = responseData.data;
        const options = document.getElementById('restaurant_results');
        restaurants.forEach(res_list => {
            res = res_list[0]
            var option = new Option(res, res);
            options.append(option);
        });

    } catch (error) {
        console.log("can't get the coupons associated with the branch id")
    }

}

//get the restaurant associated with the branch
async function getRestaurantBranches(res_name) {
    event.preventDefault();
    console.log(res_name)
    try {
        const response = await fetch(`/coupons/${res_name}/get_res_branch`, {
            method: "GET"
        });

        const responseData = await response.json();
        console.log("Response Data:", responseData);
        const branches = responseData.data;

        const options = document.getElementById("restaurant_branches");
        Object.keys(branches).forEach(key => {
            var text = key;
            var value = branches[key];
            var option = new Option(text, value);
            options.append(option);
        });

    } catch (error) {
        console.log("can't get the branches associated with the restaurant name")
    }
}

// get the coupons associated with the branch
async function getBranchCoupons(bid) {
    event.preventDefault();
    try {
        const response = await fetch(`/coupons/${bid}/get_coupon_branch`, {
            method: "GET"
        });
        const responseData = await response.json();
        const coupons = responseData.data;
        // add the options for the coupons for that branch
        const options = document.getElementById('branch_coupons');
        Object.keys(coupons).forEach(key => {
            var text = key;
            var value = coupons[key];
            var option = new Option(text, value);
            console.log(option)
            options.append(option);
        });
    } catch (error) {
        console.log("can't get the coupons associated with the branch id")
    }
}

// wait on user choice of dropdown item
function awaitSelection(selected_id) {
    return new Promise((resolve) => {
        const selected_response = document.getElementById(selected_id);
        const listener = () => {
            selected_response.disabled = true;
            selected_response.removeEventListener('change', listener);
            resolve(selected_response.value);
        };
        selected_response.addEventListener('change', listener);
    });
}

// get the number of uses of the coupon
async function updateCouponNumUse(cid) {
    event.preventDefault();
    try {
        const response = await fetch(`/coupons/${cid}/update-num-use`, {
            method: "PUT"
        });
        const responseNumUse = await response.json();
        const responseData = responseNumUse.data;
        const messageElement = document.getElementById('coupons_results');
        messageElement.textContent = responseData;
        fetchCouponTable();
    } catch (error) {
        console.log("error in updating the coupon number of uses")
    }
}

// reset the choices of a given element id
async function reset_choices(elem_id) {
    selected_response = document.getElementById(elem_id);
    if (selected_response) {
        selected_response.disabled = false;
    }
}

// reset options of given element id
async function reset_options(elem_id) {
    options = document.getElementById(elem_id);
    if (options) {
        options.innerHTML = '';
        const defaultOption = new Option("Select an option", "");
        options.add(defaultOption);
    }
}

//delete used coupons where number of uses = 0
async function deleteUsedCoupon() {
    try {
        const response = await fetch("/coupons/del-used-coupon", {
            method: "DELETE"
        });
        const responseData = await response.json();
        const deleted_coupons = responseData.data;
        const messageElement = document.getElementById('deleted_coupons');
        messageElement.textContent = deleted_coupons;
        fetchCouponTable();
    } catch (error) {
        console.log("can't delete the coupons")
    }
}

// get the options that the user chooses for placing an order:
async function getUserOptions() {
    let clearButtonClicked = false;
    let submitButtonClicked = false;

    document.getElementById("clear_order").addEventListener("click", () => {
        console.log("Clear button clicked");
        clearButtonClicked = true;
    });
    document.getElementById("submit_order").addEventListener("click", () => {
        submitButtonClicked = true;
    });
    let retry = true;
    while (retry) {
        await getRestaurants();
        const chosen_restaurant = await awaitSelection('restaurant_results');
        await getRestaurantBranches(chosen_restaurant);
        const chosen_branch = await awaitSelection('restaurant_branches');
        await getBranchCoupons(chosen_branch);
        const chosen_coupon = await awaitSelection('branch_coupons');
        console.log(chosen_branch);

        while (!clearButtonClicked && !submitButtonClicked) {
            await new Promise(resolve => setTimeout(resolve, 100));
            console.log(clearButtonClicked);
        }

        if (clearButtonClicked) {
            reset_options('restaurant_results');
            reset_options('restaurant_branches');
            reset_options('branch_coupons');

            reset_choices('restaurant_results');
            reset_choices('restaurant_branches');
            reset_choices('branch_coupons');

            clearButtonClicked = false;
            retry = true;
            continue;
        } else if (submitButtonClicked) {
            // updates the select coupon number of uses - 1
            //updateCouponNumUse(chosen_coupon);
            // deletes coupons with number of uses = 0
            //deleteUsedCoupon();
            retry = false;
            submitButtonClicked = false;
        }

    }
}




// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    checkDbConnection();
    fetchROTDData();
    document.getElementById("findUsersROTD").addEventListener("click", fetchAndDisplayROTDVisitors);
    document.getElementById("getCosts").addEventListener("click", getCosts);
};

// // General function to refresh the displayed table data.
// // You can invoke this after any table-modifying operation to keep consistency.
// function fetchTableData() {
//     fetchAndDisplayUsers();
// }
