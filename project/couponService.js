const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');
const fs = require('fs');

// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// Core functions for coupon operations

// coupon - SELECT:
// function: retrieves all the coupons in COUPON
// fetch coupons adapted from fetchDemotableFromDb from tutorial
async function fetchCoupons() {
     return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT B.restaurant_name, B.street_address, C.coupon_id, C.dc_percent, C.number_of_uses FROM Coupon C, Branch B WHERE C.branch_id = B.branch_id');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// coupon - UPDATE:
// function: decrease number of uses by one given a specific coupon id
async function updateNumberUses(cid) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('UPDATE Coupon SET number_of_uses = number_of_uses - 1 WHERE coupon_id = :coupon',
                                                {coupon: cid},
                                                { autoCommit: true }
                                                );
        return result.rowsAffected;
    }).catch(() => {
        return [];
    });
}


// coupon - DELETE:
// function: delete the coupon with no number of uses left
async function deleteCoupon() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('DELETE FROM COUPON WHERE number_of_uses = 0',
                                                [],
                                                { autoCommit: true }
                                                );
        return result.rowsAffected;
    }).catch(() => {
        return [];
    });
}

//  coupon - GROUP BY with HAVING:
// function: group the coupons by their branch_id and retrieve branches with max coupon dc >= 15%
async function retrieveGoodDealRestaurants() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT R.name, B.branch_id, B.street_address, MAX(dc_percent) FROM COUPON C, BRANCH B, RESTAURANT R WHERE R.name = B.restaurant_name AND B.branch_id = C.branch_id GROUP BY B.branch_id, B.street_address, R.name HAVING MAX(C.dc_percent) >= 0.15')
        return result.rows;
    }).catch(() => {
        return [];
    })
}

// coupon - SELECT:
// function: retrieves all restaurants from Restaurant
async function getRestaurants() {
     return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT name FROM Restaurant');
        console.log(result.rows)
        return result.rows;
    }).catch(() => {
        return [];
    });
}


//get the coupons associated with the select branch
async function getCouponBranch(bid) {
    console.log(bid)
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT C.coupon_id, C.dc_percent FROM COUPON C WHERE C.branch_id = :branch',
           {branch: bid});
        // change the resulting list to dict format
        const resultDict = {};
                result.rows.forEach(row => {
                    const [percent, id] = row;
                    resultDict[id] = percent;
                })

        return resultDict;
    }).catch(() => {
        return [];
    })
}

// get the branch addresses associated with the select restaurant
async function getRestaurantBranch(res_name) {
    console.log(res_name)
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT B.street_address, B.branch_id FROM Branch B WHERE B.restaurant_name = :name',
            {name: res_name});
        console.log(result);
        // change the list of rows into dict format
        const resultDict = {};
        result.rows.forEach(row => {
            const [address, id] = row;
            resultDict[id] = address;
        })
        return resultDict;
    }).catch(() => {
        return [];
    })
}

// module exports
module.exports = {
    fetchCoupons,
    updateNumberUses,
    deleteCoupon,
    retrieveGoodDealRestaurants,
    getRestaurantBranch,
    getCouponBranch,
    getRestaurants
};
