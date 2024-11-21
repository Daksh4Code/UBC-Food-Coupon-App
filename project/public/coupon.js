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

    queries = input.match(/\S+/g);
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
        const fetched_coupons = responseData.data;
        const messageElement = document.getElementById('searched_coupon');
        messageElement.textContent = JSON.stringify(fetched_coupons, null, 2);
    } catch (error) {
        console.error("Can't fetch coupons:", error);
    }
}


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
        const messageElement = document.getElementById('bestCoupons');
        messageElement.textContent = good_deals;

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

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
//<form id="selection">
//    branchID: <input type="text" id="selectionInput" placeholder="Enter the attributes of the coupon you wish to search" maxlength="100"> <br><br>
//    <button type="submit"> search </button> <br>
//</form>
//<div id="searched_coupon"></div>

window.onload = function() {
    fetchTableData();
    getRestaurants();
    document.getElementById("restaurant_results").addEventListener("change", getUserOptions)
    document.getElementById("numUseUpdate").addEventListener("submit", updateCouponNumUse);
    document.getElementById("selection").addEventListener("submit", checkSelectCoupon);
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
