
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



    const responseData = await response.json();

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
        const response = await fetch('/orders/get_restaurants', {
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
    console.log("LOL" + res_name)
    try {
        const response = await fetch(`/orders/${res_name}/get_res_branch`, {
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
        const response = await fetch(`/orders/${bid}/get_coupon_branch`, {
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

async function getBranchFoods(branch_id) {

    console.log("test" + branch_id);
    try {
        const response = await fetch(`/orders/${branch_id}/get-foods`, {
            method: "GET"
        });

        const responseData = await response.json();
        console.log("Response Data for FOOD: ", responseData);
        const foods = responseData.data;

        const foodDropdown = document.getElementById("food");
        foodDropdown.innerHTML = '<option value="" disabled selected>Select an option</option>'; // Clear previous options

        foods.forEach(food => {
            console.log("PLEASE " + food)
            const text = food;
            const value = food;
            if (value) {
                const option = new Option(text, value);
                foodDropdown.append(option);
            }
        });
    } catch (error) {
        console.log("Unable to fetch the foods associated with the branch ID");
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
        const response = await fetch(`/orders/${cid}/update-num-use`, {
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


function addClickListener() {
    const dropdown = document.getElementById("restaurant_results");
    dropdown.addEventListener("click", getUserOptions, { once: true });
}

function resetClickListener() {
    const dropdown = document.getElementById("restaurant_results");
    dropdown.removeEventListener("click", getUserOptions);
    addClickListener();
}

//delete used coupons where number of uses = 0
async function deleteUsedCoupon() {
    try {
        const response = await fetch("/orders/del-used-coupon", {
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

function generateOrderId() {
    return Math.floor(Math.random() * 10000); // Random number between 0 and 9999
}
// get the options that the user chooses for placing an order:
async function getUserOptions() {
    let clearButtonClicked = false;
    let submitButtonClicked = false;

    document.getElementById("clear_order").addEventListener("click", () => {
        console.log("Clear button clicked");
        clearButtonClicked = true;

        retry = false;

    });
    document.getElementById("submit_order").addEventListener("click", () => {
        submitButtonClicked = true;
        retry = false;

        alert("Order placed!")

    });
    let retry = true;
    while (retry) {
        const chosen_restaurant = await awaitSelection('restaurant_results');
        await getRestaurantBranches(chosen_restaurant);
        const chosen_branch = await awaitSelection('restaurant_branches');
        await getBranchCoupons(chosen_branch);
        await getBranchFoods(chosen_branch);

        const chosen_food = await awaitSelection('food')
        const user = await awaitSelection('username')

        const stu_num = await awaitSelection('student_number')
        const pay_met = await awaitSelection('payment_method')
        const quant = document.getElementById("quantity").value;
        const chosen_coupon = document.getElementById('branch_coupons').value;
        console.log("SEE" + chosen_branch);
        document.getElementById("submit_order").disabled = false;

        while (!clearButtonClicked && !submitButtonClicked) {
            await new Promise(resolve => setTimeout(resolve, 100));
            console.log(clearButtonClicked);
        }


        if (submitButtonClicked) {
            let order_id = generateOrderId();
            // updates the select coupon number of uses - 1
            //updateCouponNumUse(chosen_coupon);
            // deletes coupons with number of uses = 0
            //deleteUsedCoupon();

            const orderData = {
                oid: order_id,
                paymethod: pay_met,
                cid: chosen_coupon,
                bid: chosen_branch,
                aid: user,
                sid: stu_num,
                fid: chosen_food,
                quantity: quant
            };
            console.log(orderData);
            const response = await fetch('/orders/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            const result = await response.json();
            if (result.success) {
                console.log('Order successfully created!');
            } else {
                console.log('Error creating order');
            }


            retry = false;
            submitButtonClicked = false;
            clearButtonClicked = true;
            document.getElementById("submit_order").disabled = true;
            handleButtonClick();
        }
    }
}


function handleButtonClick(clearClicked) {
    alert("Order cleared.");

    reset_options('restaurant_results');
    reset_options('restaurant_branches');
    reset_options('branch_coupons');
    reset_options('food');
    reset_options('quantity');
    document.getElementById('username').value = ''
    document.getElementById('student_number').value = ''
    document.getElementById('payment_method').value = ''
    document.getElementById('quantity').value = 1
    document.getElementById('username').disabled = false;
    document.getElementById('student_number').disabled = false;
    document.getElementById('payment_method').disabled = false;
    document.getElementById('quantity').disabled = false;

    reset_choices('restaurant_results');
    reset_choices('restaurant_branches');
    reset_choices('branch_coupons');
    reset_choices('food');
    reset_choices('quantity');
    handleClearSubmit();
}



function handleClearSubmit() {

    //reset_options('restaurant_results');
    reset_options('restaurant_branches');
    reset_options('branch_coupons');
    reset_options('food');
    reset_options('quantity');
    document.getElementById('username').value = ''
    document.getElementById('student_number').value = ''
    document.getElementById('payment_method').value = ''
    document.getElementById('quantity').value = 1
    document.getElementById('username').disabled = false;
    document.getElementById('student_number').disabled = false;
    document.getElementById('payment_method').disabled = false;
    document.getElementById('quantity').disabled = false;

    //reset_choices('restaurant_results');
    document.getElementById("restaurant_results").selectedIndex = -1;
    document.getElementById("restaurant_results").value = "";
    document.getElementById('restaurant_results').disabled = false;
    resetClickListener();
    addClickListener();
    reset_choices('restaurant_branches');
    reset_choices('branch_coupons');
    reset_choices('food');
    reset_choices('quantity');
}

function handleButtonClick(clearClicked) {
    alert("Order cleared.");

    //reset_options('restaurant_results');
    reset_options('restaurant_branches');
    reset_options('branch_coupons');
    reset_options('food');
    reset_options('quantity');
    document.getElementById('username').value = ''
    document.getElementById('student_number').value = ''
    document.getElementById('payment_method').value = ''
    document.getElementById('quantity').value = 1
    document.getElementById('username').disabled = false;
    document.getElementById('student_number').disabled = false;
    document.getElementById('payment_method').disabled = false;
    document.getElementById('quantity').disabled = false;

    //reset_choices('restaurant_results');
    document.getElementById("restaurant_results").selectedIndex = -1;
    document.getElementById("restaurant_results").value = "";
    document.getElementById('restaurant_results').disabled = false;
    resetClickListener();
    addClickListener();
    reset_choices('restaurant_branches');
    reset_choices('branch_coupons');
    reset_choices('food');
    reset_choices('quantity');
}


//delete used coupons where number of uses = 0
async function createOrder() {
    const restaraunt = document.getElementById("restaurant_results");
    const branch = document.getElementById("restaurant_branches");
    const coupon = document.getElementById("branch_coupons");

    if (restaraunt === "") {
        alert("Please finish selecting order details before submitting!")
    }
    try {
        const response = await fetch("/orders/del-used-coupon", {
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



// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    checkDbConnection();
    fetchROTDData();
    document.getElementById("findUsersROTD").addEventListener("click", fetchAndDisplayROTDVisitors);
    document.getElementById("getCosts").addEventListener("click", getCosts);
    document.getElementById("submit_order").addEventListener("click", createOrder);
    document.getElementById("clear_order").addEventListener("click", handleButtonClick);
    // document.getElementById('restaurant_results').addEventListener('click', function () {
    //     addClickListener();

    // }, { once: true });
    getRestaurants();
    getUserOptions();


};

// // General function to refresh the displayed table data.
// // You can invoke this after any table-modifying operation to keep consistency.
// function fetchTableData() {
//     fetchAndDisplayUsers();
// }