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
// Fetches data from the initalized Tables and displays it.
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
// get the number of uses of the coupon
async function updateCouponNumUse() {
    event.preventDefault();
    const cid = document.getElementById('couponID').value;
        try {
            const response = await fetch(`/coupons/${cid}/update-num-use`, {
                method: "PUT"
            });
            const responseNumUse = await response.json();
            const responseData = responseNumUse.data;
            const messageElement = document.getElementById('coupons_results');
            messageElement.textContent = responseData;
            fetchCouponTable();
        } catch(error) {
            console.log("error in updating the coupon number of uses")
        }


}
//get the coupons associated with the branch
async function getBranchCoupons(bid) {
    event.preventDefault();
    console.log(bid)
    try {
            const response = await fetch(`/coupons/${bid}/get_coupon_branch`, {
            method : "GET"
        });
        const responseData = await response.json();
        const coupons = responseData.data;
        const messageElement = document.getElementById('coupons_results');
        messageElement.textContent = coupons;
        console.log(coupons)
        const options = document.getElementById('branch_coupons');
        Object.keys(coupons).forEach(key => {
                    var text = key;
                    var value = coupons[key];
                    var option = new Option(text, value);
                    console.log(option)
                    options.append(option);
                });


    } catch(error) {
        console.log("can't get the coupons associated with the branch id")
    }


}

//get all restaurants
async function getRestaurants() {
    event.preventDefault();
    try {
            const response = await fetch('/coupons/get_restaurants', {
            method : "GET"
        });
        const responseData = await response.json();
        const restaurants = responseData.data;

        const options = document.getElementById('restaurant_results');
        restaurants.forEach(res_list => {
            res = res_list[0]
            var option = new Option(res, res);
            options.append(option);
        });

    } catch(error) {
        console.log("can't get the coupons associated with the branch id")
    }

}

//get the restaurant associated with the branch
async function getRestaurantBranches(res_name) {
    event.preventDefault();
    console.log(res_name)
    try {
            const response = await fetch(`/coupons/${res_name}/get_res_branch`, {
            method : "GET"
        });
        const responseData = await response.json();
        const branches = responseData.data;
        const messageElement = document.getElementById('branches_results');
        messageElement.textContent = branches;
        const options = document.getElementById("restaurant_branches");
        console.log(branches)
        Object.keys(branches).forEach(key => {
            var text = key;
            var value = branches[key];
            var option = new Option(text, value);
            console.log(option)
            options.append(option);
        });

    } catch(error) {
        console.log("can't get the branches associated with the restaurant name")
    }



}
//delete used coupons where number of uses = 0
async function deleteUsedCoupon() {
    try {
        const response = await fetch("/coupons/del-used-coupon", {
            method : "DELETE"
        });
        const responseData = await response.json();
        const deleted_coupons = responseData.data;
        const messageElement = document.getElementById('deleted_coupons');
        messageElement.textContent = deleted_coupons;
        fetchCouponTable();
    } catch(error) {
        console.log("can't delete the coupons")
    }
}

//check and select coupons specified by the user
async function checkSelectCoupon() {
    event.preventDefault()
    const input = document.getElementById('selectionInput').value.trim();
    console.log(input)
    const validCouponAttributes = ["coupon_id", "dc_percent", "number_of_uses"];
    const validBranchAttributes =  ["street_address", "restaurant_name"];
    const validOperators = ["=", "AND", "OR"];

    let sql_query = "SELECT B.restaurant_name, B.street_address, C.coupon_id, C.dc_percent, C.number_of_uses";
    let from = " FROM COUPON C, Branch B ";
    let join = "WHERE B.branch_id = C.branch_id AND ";

    queries = input.match(/(?:'[^']*'|\S+)/g);
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
            console.error(`Invalid operator or attribute: ${split_query}`);
            return;
        }
    };
    queries = queries.join(" ")
    sql_query += from + join + queries;
    console.log(sql_query);


    try {
        const response = await fetch("http://localhost:65535/coupons/fetch-selected", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: sql_query })
        });

        const responseData = await response.json();
        const messageElement = document.getElementById('searched_coupon');

        if (!responseData.success) {
            messageElement.textContent = responseData.message;
        } else {
            const fetched_coupons = responseData.data;
            const tableElement = document.getElementById('couponTable');
            const tableBody = tableElement.querySelector('tbody');
            if (tableBody) {
                tableBody.innerHTML = '';
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

// project the columns from the table requested by the user
async function checkProjectCoupon() {
    event.preventDefault()

    const input = document.getElementById('projectionInput').value.trim();
    const messageElement = document.getElementById('projection_table');

    const validCouponAttributes = ["coupon_id", "dc_percent", "number_of_uses"];
    const validBranchAttributes =  ["street_address", "restaurant_name"];
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
            // create the table
            const project_table = responseData.data;
            const tableElement = document.getElementById('projectTable');
            const tableHead = tableElement.querySelector('thead');
            const tableBody = tableElement.querySelector('tbody');

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
    //B.branch_id, B.street_address, R.name, MAX(dc_percent)
    const tableElement = document.getElementById('bestCouponTable');
    const tableBody = tableElement.querySelector('tbody');
    try {
        const response = await fetch("/coupons/retrieve-good-deal-restaurant", {
            method : "GET"
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

    } catch(error) {
        console.log("error in retrieving the best deals!")
    }
}

window.onload = function() {
    fetchTableData();
    getRestaurants();
    document.getElementById("restaurant_results").addEventListener("change", getUserOptions)
    document.getElementById("numUseUpdate").addEventListener("submit", updateCouponNumUse);
    document.getElementById("selection").addEventListener("submit", checkSelectCoupon);
    document.getElementById("projection").addEventListener("submit", checkProjectCoupon);
//    document.getElementById("couponBranch").addEventListener("submit", getBranchCoupons);
//    document.getElementById("restaurantBranches").addEventListener("submit", getRestaurantBranches);
    document.getElementById("viewBestCoupon").addEventListener("click", getGoodDealRestaurant);
    document.getElementById("delete_coupons").addEventListener("click", deleteUsedCoupon);
    document.getElementById('restaurant_results').addEventListener('change', getUserOptions);
    document.getElementById('restaurantBranches').addEventListener('change', getUserOptions);
    document.getElementById('branch_coupons').addEventListener('change', getUserOptions);

};
async function getUserOptions() {
    const chosen_restaurant = document.getElementById('restaurant_results').value;
    console.log(chosen_restaurant);
    await getRestaurantBranches(chosen_restaurant);
    const chosen_branch = document.getElementById('restaurantBranches').value;
    console.log(chosen_branch);
    await getBranchCoupons(chosen_branch);
    const chosen_coupon = document.getElementById('branch_coupons').value;
    console.log(chosen_branch);
}
// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchCouponTable();
}
