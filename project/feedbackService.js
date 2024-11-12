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

// Core functions for feedback operations

// feedback - INSERT:
// function: submits feedback given account ID, sid, order date, branch ID, and rating
async function submitFeedback(accountId, sid, order_date, branchId, rating) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('INSERT INTO feedback (account_id, sid, order_date, branch_id, rating) VALUES (:accountId, :sid, :order_date, :branchId, :rating)',
            [accountId, sid, order_date, branchId, rating],
            { autoCommit: true }
        );
        return result.rowsAffected;
    }).catch(() => {
          return false;
      });
}

// feedback - UPDATE:
// function: updates the feedback rating given account ID, sid, order date,
// branch ID, and new rating
async function updateFeedback(accountId, sid, order_date, branchId, newRating) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('UPDATE feedback SET rating = :newRating WHERE account_id = :accountId AND sid = :sid AND order_date = :order_date AND branch_id = :branchId',
            [newRating, accountId, sid, order_date, branchId],
            { autoCommit: true }
        );
        return result.rowsAffected;
    }).catch(() => {
          return [];
      });

}

// feedback - SELECT:
// function: views feedback given an account ID
async function viewFeedback(accountId) {
        return await withOracleDB(async (connection) => {
            const result = await connection.execute('SELECT * FROM feedback WHERE account_id = :accountId',
                [accountId]
            );
            return result.rows;
        });
    }).catch(() => {
          return [];
      });
}

// feedback - GROUP BY with HAVING
// function: retrieves the best-rated branch
async function getBestRatedBranch() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT branch_id FROM feedback GROUP BY branch_id HAVING AVG(rating) = (SELECT MAX(AVG(rating)) FROM feedback GROUP BY branch_id)');
            return result.rows;
        });
    }).catch(() => {
          return [];
      });
}

// module exports
module.exports = {

};


