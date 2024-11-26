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

// Core functions for user operations

// user - INSERT: Create a new user
async function createUser(accountId, year, major, password, sid, cwl) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'INSERT INTO users (account_id, year, major, password, sid, cwl) VALUES (:accountId, :year, :major, :password, :sid, :cwl)',
            [accountId, year, major, password, sid, cwl],
            { autoCommit: true }
        );
        return result.rowsAffected;
    }).catch((err) => {
        console.error("Error creating user:", err); // Log the error for debugging
        return false;
    });
}

// user - UPDATE: Update user's password
async function editUser(accountId, newPassword) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'UPDATE users SET password = :newPassword WHERE account_id = :accountId',
            [newPassword, accountId],
            { autoCommit: true }
        );
        return result.rowsAffected;
    }).catch(() => {
        return false; // Indicate failure
    });
}

// user - SELECT: Log in a user
async function loginUser(cwl, password) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT * FROM users WHERE cwl = :cwl AND password = :password',
            [cwl, password]
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// Module exports
module.exports = {
    createUser,
    editUser,
    loginUser
};
