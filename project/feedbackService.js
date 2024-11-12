const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');
const fs = require('fs');

const envVariables = loadEnvFile('./.env');

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
