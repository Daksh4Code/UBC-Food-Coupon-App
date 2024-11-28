// THIS FILE WAS EDITED FROM THE ORIGINAL SAMPLE PROJECT server.js FILE
const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

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


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM DEMOTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE DEMOTABLE`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE DEMOTABLE (
                id NUMBER PRIMARY KEY,
                name VARCHAR2(20)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertDemotable(id, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
            [id, name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

async function getROTDVisitors() {
    return await withOracleDB(async (connection) => {
        const query = `
        SELECT DISTINCT a.account_id 
        FROM Account a
        WHERE NOT EXISTS (
            SELECT 1
            FROM RestaurantOTD r
            WHERE NOT EXISTS (
                SELECT d.order_id
                FROM Delivery d, Branch b
                WHERE d.branch_id = b.branch_id
                AND d.account_id = a.account_id
                AND b.restaurant_name = r.name
                UNION
                SELECT p.order_id
                FROM Pickup p, Branch b
                WHERE p.branch_id = b.branch_id
                AND p.account_id = a.account_id
                AND b.restaurant_name = r.name
            )
        )

    `;

        try {
            const result = await connection.execute(query);
            console.log('result:', result);
            return result.rows;
        } catch (err) {
            console.error('bruh', err);
            return [];
        }
    }).catch((err) => {
        console.error('Error with connection:', err);
        return [];
    });
}

async function getOrderCosts() {
    return await withOracleDB(async (connection) => {
        const query = `
        SELECT d.order_id, 
            b.restaurant_name, 
            SUM(f.cost * c.quantity)
        FROM Delivery d, Branch b, Consists_Delivery c, Food f
        WHERE d.branch_id = b.branch_id 
        AND d.order_id = c.order_id 
        AND c.food_name = f.food_name
        GROUP BY d.order_id, b.restaurant_name

        UNION

        SELECT p.order_id, 
            b.restaurant_name, 
            SUM(f.cost * c.quantity)
        FROM Pickup p, Branch b, Consists_Pickup c, Food f
        WHERE p.branch_id = b.branch_id 
        AND p.order_id = c.order_id 
        AND c.food_name = f.food_name
        GROUP BY p.order_id, b.restaurant_name
                        `;

        try {
            const result = await connection.execute(query);
            console.log('result:', result);
            return result.rows;
        } catch (err) {
            console.error('bruh', err);
            return [];
        }
    }).catch((err) => {
        console.error('Error with connection:', err);
        return [];
    });
}


async function getROTD() {
    return await withOracleDB(async (connection) => {
        const query = `
        SELECT r.name
        FROM RestaurantOTD r
                        `;

        try {
            const result = await connection.execute(query);
            console.log('result:', result);
            return result.rows;
        } catch (err) {
            console.error('bruh', err);
            return [];
        }
    }).catch((err) => {
        console.error('Error with connection:', err);
        return [];
    });
}


// FUNCTIONALITY FOR ORDER:
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
            { branch: bid });
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
            { name: res_name });
        console.log(result);
        // change the list of rows into dict format
        const resultDict = {};
        result.rows.forEach(row => {
            const [address, id] = row;
            resultDict[address] = id;
        })
        return resultDict;
    }).catch(() => {
        return [];
    })
}




module.exports = {
    testOracleConnection,
    fetchDemotableFromDb,
    initiateDemotable,
    insertDemotable,
    updateNameDemotable,
    countDemotable,
    getROTDVisitors,
    getOrderCosts,
    getROTD,
    getRestaurantBranch,
    getRestaurants,
    getCouponBranch
};