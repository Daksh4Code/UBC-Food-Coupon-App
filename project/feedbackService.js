const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');
const fs = require('fs');
const envVariables = loadEnvFile('./.env');

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

// Core functions for feedback operations

// feedback - INSERT: Submit feedback
async function submitFeedback(accountId, sid, order_date, branchId, rating) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `INSERT INTO FEEDBACK_RATING (ACCOUNT_ID, SID, ORDER_DATE, BRANCH_ID, RATING)
                 VALUES (:accountId, :sid, TO_DATE(:order_date, 'YYYY-MM-DD'), :branchId, :rating)`,
                [accountId, sid, order_date, branchId, rating],
                { autoCommit: true }
            );
            return result.rowsAffected;
        } catch (error) {
            console.error('Error submitting feedback:', error);
            return 0;
        }
    });
}

// feedback - UPDATE: Update feedback rating
async function updateFeedback(accountId, sid, order_date, branchId, newRating) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `UPDATE FEEDBACK_RATING
                 SET RATING = :newRating
                 WHERE ACCOUNT_ID = :accountId
                   AND SID = :sid
                   AND ORDER_DATE = TO_DATE(:order_date, 'YYYY-MM-DD')
                   AND BRANCH_ID = :branchId`,
                [newRating, accountId, sid, order_date, branchId],
                { autoCommit: true }
            );
            return result.rowsAffected;
        } catch (error) {
            console.error('Error updating feedback:', error);
            return 0;
        }
    });
}

// feedback - SELECT: View feedback for an account
async function viewFeedback(accountId) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                'SELECT * FROM FEEDBACK_RATING WHERE ACCOUNT_ID = :accountId',
                [accountId]
            );
            return result.rows;
        } catch (error) {
            console.error('Error viewing feedback:', error);
            return [];
        }
    });
}

// feedback - GROUP BY with HAVING: Get the best-rated branch
async function getBestRatedBranch() {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `SELECT BRANCH_ID
                FROM FEEDBACK_RATING
                GROUP BY BRANCH_ID
                HAVING AVG(RATING) = (SELECT MAX(AVG(RATING)) FROM FEEDBACK_RATING GROUP BY BRANCH_ID)`
            );
            return result.rows;
        } catch (error) {
            console.error('Error fetching best-rated branch:', error);
            return [];
        }
    });
}

// feedback - DELETE: Delete a feedback
async function deleteFeedback(accountId, sid, order_date, branchId) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `DELETE FROM FEEDBACK_RATING
                 WHERE ACCOUNT_ID = :accountId
                   AND SID = :sid
                   AND ORDER_DATE = TO_DATE(:order_date, 'YYYY-MM-DD')
                   AND BRANCH_ID = :branchId`,
                [accountId, sid, order_date, branchId],
                { autoCommit: true }
            );
            return result.rowsAffected;
        } catch (error) {
            console.error('Error deleting feedback:', error);
            return 0;
        }
    });
}

// feedback - SELECT: Get all feedbacks
async function getAllFeedbacks() {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                'SELECT * FROM FEEDBACK_RATING'
            );
            return result.rows;
        } catch (error) {
            console.error('Error fetching all feedbacks:', error);
            return [];
        }
    });
}

// Module exports
module.exports = {
    submitFeedback,
    updateFeedback,
    viewFeedback,
    getBestRatedBranch,
    deleteFeedback,
    getAllFeedbacks
};