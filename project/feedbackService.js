const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');
const fs = require('fs');
const envVariables = loadEnvFile('./.env');

/*
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

*/

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

/*
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}
*/

// Core functions for feedback operations

// feedback - INSERT: Submit feedback
async function submitFeedback(accountId, sid, order_date, branchId, rating) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'INSERT INTO Feedback_Rating (account_id, sid, order_date, branch_id, rating) VALUES (:accountId, :sid, :order_date, :branchId, :rating)',
            [accountId, sid, order_date, branchId, rating],
            { autoCommit: true }
        );
        return result.rowsAffected;
    }).catch((error) => {
        console.error('Error submitting feedback:', error);
        return 0;
    });
}

// feedback - UPDATE: Update feedback rating
async function updateFeedback(accountId, sid, order_date, branchId, newRating) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'UPDATE Feedback_Rating SET rating = :newRating WHERE account_id = :accountId AND sid = :sid AND order_date = :order_date AND branch_id = :branchId',
            [newRating, accountId, sid, order_date, branchId],
            { autoCommit: true }
        );
        return result.rowsAffected;
    }).catch((error) => {
        console.error('Error updating feedback:', error);
        return 0;
    });
}

// feedback - SELECT: View feedback for an account
async function viewFeedback(accountId) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                'SELECT * FROM Feedback_Rating WHERE account_id = :accountId',
                [accountId]
            );
            if (result.rows.length > 0) {
                return result.rows;
            } else {
                console.error('Error viewing feedback: No feedback found.');
                return [];
            }
        } catch (error) {
            console.error('Error viewing feedback:', error);
            return [];
        }
    });
}

// feedback - GROUP BY with HAVING: Get the best-rated branch
async function getBestRatedBranch() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT branch_id FROM Feedback_Rating GROUP BY branch_id HAVING AVG(rating) = (SELECT MAX(AVG(rating)) FROM Feedback_Rating GROUP BY branch_id)'
        );
        return result.rows;
    }).catch((error) => {
        console.error('Error fetching best-rated branch:', error);
        return [];
    });
}

// feedback - DELETE: Delete a feedback
async function deleteFeedback(accountId, sid, order_date, branchId) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'DELETE FROM Feedback_Rating WHERE account_id = :accountId AND sid = :sid AND order_date = :order_date AND branch_id = :branchId',
            [accountId, sid, order_date, branchId],
            { autoCommit: true }
        );
        return result.rowsAffected;
    }).catch((error) => {
        console.error('Error deleting feedback:', error);
        return 0;
    });
}

// feedback - PROJECTION: Get restaurants by address
async function getRestaurantsByAddress(inputAddress) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT R.name FROM Restaurant R JOIN Branch B ON R.name = B.restaurant_name WHERE B.street_address LIKE \'%\' || :input_address || \'%\'',
            [inputAddress]
        );
        return result.rows;
    }).catch((error) => {
        console.error('Error fetching restaurants by address:', error);
        return [];
    });
}

// Module exports
module.exports = {
    submitFeedback,
    updateFeedback,
    viewFeedback,
    getBestRatedBranch,
    deleteFeedback,
    getRestaurantsByAddress
};

