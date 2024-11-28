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

// Fetches data from the initialized Tables and displays it.
async function fetchCouponTable() {
    const tableElement = document.getElementById('couponTable');
    const tableBody = tableElement.querySelector('tbody');

    try {
        const response = await fetch('/coupons/fetch', {
            method: 'GET'
        });

        const responseData = await response.json();
        const coupontable = responseData.data;

        // Always clear old, already fetched data before new fetching process.
        if (tableBody) {
            tableBody.innerHTML = '';
        }
        coupontable.forEach(user => {
            const row = tableBody.insertRow();
            user.forEach((field, index) => {
                const cell = row.insertCell(index);
                cell.textContent = field;
            });
        });
    } catch (error) {
        console.error("unable to fetch table")
    }
}


//check and select coupons specified by the user
async function checkSelectCoupon() {
    event.preventDefault()
    const messageElement = document.getElementById('searched_coupon');

    const input = document.getElementById('selectionInput').value.trim();
    const validCouponAttributes = ["coupon_id", "dc_percent", "number_of_uses"];
    const validBranchAttributes = ["street_address", "restaurant_name"];
    const validOperators = ["=", "AND", "OR"];

    let sql_query = "SELECT B.restaurant_name, B.street_address, C.coupon_id, C.dc_percent, C.number_of_uses";
    let from = " FROM COUPON C, Branch B ";
    let join = "WHERE B.branch_id = C.branch_id AND (";

    queries = input.match(/(?:'[^']*'|\S+)/g);
    if (queries === null) {
        sql_query += from + "WHERE B.branch_id = C.branch_id";
    } else {
        for (let i = 0; i < queries.length; i++) {
            const split_query = queries[i];
            if (i % 4 == 0) {
                if (validCouponAttributes.includes(split_query)) {
                    const coupon_sql = "C." + split_query;
                    queries[i] = coupon_sql;
                } else if (validBranchAttributes.includes(split_query)) {
                    const branch_sql = "B." + split_query;
                    queries[i] = branch_sql;
                }
            } else if ((i + 1) % 2 == 0 && validOperators.includes(split_query)) {
                continue;
            }
            else if (i % 2 == 0 && !validOperators.includes(split_query) && !validCouponAttributes.includes(split_query) && !validBranchAttributes.includes(split_query)) {
                continue;
            } else {
                messageElement.textContent = `Invalid operator or attribute: ${split_query}`;
                return;
            }
        };
        queries = queries.join(" ")
        sql_query += from + join + queries + ")";
        console.log("query", sql_query)
    }


    try {
        const response = await fetch("http://localhost:65535/coupons/fetch-selected", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: sql_query })
        });

        const responseData = await response.json();
        if (!responseData.success) {
            messageElement.textContent = responseData.message;
        } else {
            const fetched_coupons = responseData.data;
            const tableElement = document.getElementById('couponTable');
            const tableBody = tableElement.querySelector('tbody');
            if (tableBody || messageElement) {
                tableBody.innerHTML = '';
                messageElement.textContent = '';
            }
            fetched_coupons.forEach(user => {
                const row = tableBody.insertRow();
                user.forEach((field, index) => {
                    const cell = row.insertCell(index);
                    cell.textContent = field;
                });
            });

        };
    } catch (error) {
        console.error("Can't fetch coupons:", error);
    }
}


function convertFields(inputStr) {
    const fieldMapping = {
        "Address": "street_address",
        "Restaurant": "restaurant_name",
        "Coupon_ID": "coupon_id",
        "Discount": "dc_percent",
        "Number_of_Uses_Left": "number_of_uses"
    };

    const fields = inputStr.split(' ');

    const convertedFields = fields.map(field => {
        const fieldWithUnderscore = field.replace(/\s+/g, '_'); // Convert spaces to underscores
        return fieldMapping[fieldWithUnderscore] || fieldWithUnderscore.toLowerCase(); // Apply mapping or convert to lowercase
    });

    return convertedFields.join(' ');
}

// project the columns from the table requested by the user
async function checkProjectCoupon() {
    event.preventDefault()

    const input = convertFields(document.getElementById('projectionInput').value).trim();
    const messageElement = document.getElementById('projection_table');

    const validCouponAttributes = ["coupon_id", "dc_percent", "number_of_uses"];
    const validBranchAttributes = ["street_address", "restaurant_name"];
    const validOperators = ["=", "AND", "OR"];

    let sql_query = "SELECT ";
    let rest = " FROM COUPON C, Branch B WHERE B.branch_id = C.branch_id";

    queries = input.match(/\S+/g);
    for (let i = 0; i < queries.length; i++) {
        const split_query = queries[i];
        if (validCouponAttributes.includes(split_query)) {
            const coupon_sql = "C." + split_query + ",";
            sql_query += coupon_sql;
        } else if (validBranchAttributes.includes(split_query)) {
            const branch_sql = "B." + split_query + ",";
            sql_query += branch_sql;
        } else {
            messageElement.textContent = `Invalid operator or attribute: ${split_query}`;
            return;
        };
    };

    sql_query = sql_query.replace(/,\s*$/, "");

    sql_query += rest;

    try {
        const response = await fetch("/coupons/project", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: sql_query })
        });
        responseData = await response.json();
        if (!responseData.success) {
            messageElement.textContent = "there was an error fetching the data"
        } else {
            const project_table = responseData.data;
            const tableElement = document.getElementById('projectTable');
            const tableHead = tableElement.querySelector('thead');
            const tableBody = tableElement.querySelector('tbody');

            // Always clear old, already fetched data before new fetching process.
            if (tableBody || tableHead || messageElement) {
                tableBody.innerHTML = '';
                tableHead.innerHTML = '';
                messageElement.textContent = '';
            }
            // create the table
            const columnNames = document.createElement('tr');
            queries.forEach(query => {
                const th = document.createElement('th');
                th.textContent = query;
                columnNames.appendChild(th);
            });
            tableHead.appendChild(columnNames);

            project_table.forEach(row => {
                const tr = document.createElement('tr');
                row.forEach(cell => {
                    const td = document.createElement('td');
                    td.textContent = cell;
                    tr.appendChild(td);
                });
                tableBody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error("Can't project table:", error);
    }
}

//get the restaurant with good deals
async function getGoodDealRestaurant() {
    const tableElement = document.getElementById('bestCouponTable');
    const tableBody = tableElement.querySelector('tbody');
    try {
        const response = await fetch("/coupons/retrieve-good-deal-restaurant", {
            method: "GET"
        });

        const responseData = await response.json();
        const good_deals = responseData.data;
        if (tableBody) {
            tableBody.innerHTML = '';
        }
        good_deals.forEach(user => {
            const row = tableBody.insertRow();
            user.forEach((field, index) => {
                const cell = row.insertCell(index);
                cell.textContent = field;
            });
        });

    } catch (error) {
        console.log("error in retrieving the best deals!")
    }
}



window.onload = function () {
    fetchCouponTable();
    getUserOptions();
    document.getElementById("numUseUpdate").addEventListener("submit", updateCouponNumUse);
    document.getElementById("selection").addEventListener("submit", checkSelectCoupon);
    document.getElementById("projection").addEventListener("submit", checkProjectCoupon);
    document.getElementById("viewBestCoupon").addEventListener("click", getGoodDealRestaurant);
    document.getElementById("delete_coupons").addEventListener("click", deleteUsedCoupon);


};

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


