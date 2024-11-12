const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');
const fs = require('fs');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
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

async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

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

// Core functions for feedback operations

// feedback - INSERT:
// function: submits feedback given account ID, sid, order date, branch ID, and
// rating
async function submitFeedback(accountId, sid, order_date, branchId, rating) {
    try {
        return await withOracleDB(async (connection) => {
            const result = await connection.execute(
                'INSERT INTO feedback (account_id, sid, order_date, branch_id, rating) VALUES (:accountId, :sid, :order_date, :branchId, :rating)',
                [accountId, sid, order_date, branchId, rating],
                { autoCommit: true }
            );
            return result.rowsAffected;
        });
    }.catch((error) => {
             console.error('Error submitting feedback:', error);
             return 0;
         });
}

// feedback - UPDATE:
// function: updates the feedback rating given account ID, sid, order date,
// branch ID, and new rating
async function updateFeedback(accountId, sid, order_date, branchId, newRating) {
    try {
        return await withOracleDB(async (connection) => {
            const result = await connection.execute(
                'UPDATE feedback SET rating = :newRating WHERE account_id = :accountId AND sid = :sid AND order_date = :order_date AND branch_id = :branchId',
                [newRating, accountId, sid, order_date, branchId],
                { autoCommit: true }
            );
            return result.rowsAffected;
        });
    }.catch((error) => {
             console.error('Error updating feedback:', error);
             return 0;
         });
}

// feedback - SELECT:
// function: views feedback given an account ID
async function viewFeedback(accountId) {
    try {
        return await withOracleDB(async (connection) => {
            const result = await connection.execute(
                'SELECT * FROM feedback WHERE account_id = :accountId',
                [accountId]
            );
            return result.rows;
        });
    }.catch((error) => {
             console.error(`Error viewing feedback for account ID ${accountId}:`, error);
             return [];
         });
}

// feedback - GROUP BY with HAVING
// function: retrieves the best-rated branch
async function getBestRatedBranch() {
    try {
        return await withOracleDB(async (connection) => {
            const result = await connection.execute(
                'SELECT branch_id FROM feedback GROUP BY branch_id HAVING AVG(rating) = (SELECT MAX(AVG(rating)) FROM feedback GROUP BY branch_id)'
            );
            return result.rows;
        });
    }.catch((error) => {
             console.error('Error finding best-rated branch:', error);
             return [];
         });
}

// Core functions for user operations

// user - INSERT:
// function: creates a user given account ID, year, major, password, sid, and cwl
async function createUser(accountId, year, major, password, sid, cwl) {
    try {
        return await withOracleDB(async (connection) => {
            const result = await connection.execute(
                'INSERT INTO users (account_id, year, major, password, sid, cwl) VALUES (:accountId, :year, :major, :password, :sid, :cwl)',
                [accountId, year, major, password, sid, cwl],
                { autoCommit: true }
            );
            return result.rowsAffected;
        });
    }.catch((error) => {
              console.error('Error creating user:', error);
              return 0;
          });
}

// user - UPDATE:
// function: updates user password given an account ID and a new password
async function editUser(accountId, newPassword) {
    try {
        return await withOracleDB(async (connection) => {
            const result = await connection.execute(
                'UPDATE users SET password = :newPassword WHERE account_id = :accountId',
                [newPassword, accountId],
                { autoCommit: true }
            );
            return result.rowsAffected;
        });
    }.catch((error) => {
              console.error(`Error editing user with ID ${accountId}:`, error);
              return 0;
          });
}

// user - SELECT:
// function: logs in a user given cwl and password
async function loginUser(cwl, password) {
    try {
        return await withOracleDB(async (connection) => {
            const result = await connection.execute(
                'SELECT * FROM users WHERE cwl = :cwl AND password = :password',
                [cwl, password]
            );
            return result.rows;
        });
    }.catch((error) => {
             console.error('Error logging in user:', error);
             return [];
         });
}

// Core functions for order operations


// module exports
module.exports = {

};
