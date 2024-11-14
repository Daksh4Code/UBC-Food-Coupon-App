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
    //    console.log(coupontable)

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
    const response = await fetch("/coupons/:cid/update-num-use", {
        method: "PUT"
    });

    const responseNumUse = await response.json();
    const responseData = responseNumUse.data;
    const messageElement = document.getElementById('couponNumUse');

    if (responseData.success) {
        messageElement.textContent = "Coupon Number of Uses Updated Successfully!";
        fetchCouponTable();
    } else {
        messageElement.textContent = "Error updating number of uses!";
    }

}

//async function deleteUsedCoupon() {
//    const response = await fetch("/coupons/:cid/delete-used-coupon", {
//        method = "PUT"
//    });
//}
//
//async function getGoodDealRestaurant() {
//    const response = await fetch("/coupons/retrieve-good-deal-restaurant", {
//        method = "GET"
//    });
//}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    fetchTableData();
    document.getElementById("updateNumUse").addEventListener("click", updateCouponNumUse);
//    document.getElementById("deleteUsedCoupon").addEventListener("click", deleteUsedCoupon);
//    document.getElementById("getGoodDealRestaurant").addEventListener("submit", getGoodDealRestaurant);

};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchCouponTable();
}
