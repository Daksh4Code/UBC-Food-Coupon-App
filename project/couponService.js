const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');
const fs = require('fs');

// Core functions for coupon operations

// coupon - SELECT:
// function: retrieves all the coupons in COUPON
// fetch coupons adapted from fetchDemotableFromDb from tutorial
async function fetchCoupons() {
     return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT C.coupon_id, C.dc_percent FROM Coupon C');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// coupon - UPDATE:
// function: decrease number of uses by one given a specific coupon id
async function updateNumberUses(cid) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('UPDATE Coupon SET number_of_uses =: number_of_uses - 1 WHERE coupon_id := cid',
                                                [cid],
                                                { autoCommit: true }
                                                );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// coupon - DELETE:
// function: delete the coupon with no number of uses left
async function deleteCoupon() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('DELETE FROM COUPON WHERE number_of_uses = 0');
    }).catch(() => {
        return False;
    });
}

//  coupon - GROUP BY with HAVING:
// function: group the coupons by their branch_id and retrieve branches with min coupon dc > 15%
async function retrieveGoodDealRestaurants() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT branch_id, MIN(dc_percent) FROM COUPON GROUP BY branch_id HAVING MIN(dc_percent) >= 0.15')
    }).catch(() => {
        return [];
    })
}
// module exports
module.exports = {
    fetchCoupons,
    updateNumberUses,
    deleteCoupon,
    retrieveGoodDealRestaurants

};
