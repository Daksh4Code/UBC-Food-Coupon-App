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



// Core functions for delivery operations

async function generateDelivery(total_cost,order_date,payment_method,promo_code,coupon_id,branch_id,account_id,sid,delivery_cost,delivery_status,delivery_time) {
    return await withOracleDB(async (connection) => {
        const del_ids = await connection.execute('SELECT order_id FROM delivery').rows.map(row => row.ORDER_ID);
        const pic_ids = await connection.execute('SELECT order_id FROM pickup').rows.map(row => row.ORDER_ID);

        console.log(del_ids);
        console.log(pic_ids);
        console.log(testOracleConnection())

        let id = Math.random();
        while (del_ids.contains(id) || pic_ids.contains(id)) {
            id = Math.random();
        }
        await connection.execute('INSERT INTO Delivery VALUES (id, total_cost, TO_DATE(\'17/12/2015\', \'DD/MM/YYYY\'), ' +
            '\'Debit\',\'FAKECOUPON\',\'2G2303D3\', \'S0002\',\'acc001\',\'12345678\',2.99, \'Complete\', 1.2\n' +
            '                            );');

        // NOT DONE, CHANGE ABOVE EXECUTE AND ALSO UPDATE THINGS RELIANT ON ORDER ID, LIKE CONSISTS_DELIVERY
        return result.rows;
    })
    .catch(() => {
    return [];
    });
}
const currentDate = new Date();
const formattedDate = currentDate.toISOString().split('T')[0];  // Extracts the date part (YYYY-MM-DD),  // Example ISO 8601 date



async function updateStatus(orderID, newStatus) {
}

async function getOrderDetails(orderID) {
}


// module exports
module.exports = {
    generateDelivery,
    updateStatus,
    getOrderDetails
};