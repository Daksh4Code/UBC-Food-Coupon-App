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
// function: decrease number of uses by one of a specified coupon
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
    }.catch(() => {
        return False;
    });
}

//  coupon - GROUP BY with HAVING:
// function: group the coupons by their branch_id and retrieve branches with average coupon dc > 10%
async function retrieveHighDCCoupons() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT C.coupon_id FROM COUPON C GROUP BY branch_id HAVING AVG(dc_percent) >= 0.10')
    }).catch(() => {
        return [];
    })
}

}

// Core functions for feedback operations
// Core functions for user operations
// Core functions for order operations

module.exports = {
    fetchCoupons,
    updateNumberUses,
    deleteCoupon,
    retrieveHighDCCoupons
};

// FUNCTINOALIITY FROM DEMO:
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
//async function testOracleConnection() {
//    return await withOracleDB(async (connection) => {
//        return true;
//    }).catch(() => {
//        return false;
//    });
//}
//
//async function initializeSQLTables(sql_path) {
//    const script = fs.readFileSync(sql_path, 'utf8')
//                .replace(/\\n/g, '')
//                .replace(/\\t/g, '')
//    const queries = script.split(";").filter(query => query != '')
//    console.log(queries);
//    for (sql in queries) {
//        await withOracleDB(async (connection) => {
//            await connection.execute(sql);
//            console.log(sql);
//            console.log('Table inserted...');
//        });
//    }
//}
//
//
//async function fetchDemotableFromDb() {
//    return await withOracleDB(async (connection) => {
//        const result = await connection.execute('SELECT * FROM DEMOTABLE');
//        return result.rows;
//    }).catch(() => {
//        return [];
//    });
//}
//
//async function initiateDemotable() {
//    return await withOracleDB(async (connection) => {
//        try {
//            await connection.execute(`DROP TABLE DEMOTABLE`);
//        } catch(err) {
//            console.log('Table might not exist, proceeding to create...');
//        }
//
//        const result = await connection.execute(`
//            CREATE TABLE DEMOTABLE (
//                id NUMBER PRIMARY KEY,
//                name VARCHAR2(20)
//            )
//        `);
//        return true;
//    }).catch(() => {
//        return false;
//    });
//}
//
//async function insertDemotable(id, name) {
//    return await withOracleDB(async (connection) => {
//        const result = await connection.execute(
//            `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
//            [id, name],
//            { autoCommit: true }
//        );
//
//        return result.rowsAffected && result.rowsAffected > 0;
//    }).catch(() => {
//        return false;
//    });
//}
//
//async function updateNameDemotable(oldName, newName) {
//    return await withOracleDB(async (connection) => {
//        const result = await connection.execute(
//            `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
//            [newName, oldName],
//            { autoCommit: true }
//        );
//
//        return result.rowsAffected && result.rowsAffected > 0;
//    }).catch(() => {
//        return false;
//    });
//}
//
//async function countDemotable() {
//    return await withOracleDB(async (connection) => {
//        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
//        return result.rows[0][0];
//    }).catch(() => {
//        return -1;
//    });
//}
//
//
//module.exports = {
//    testOracleConnection,
//    fetchDemotableFromDb,
//    initiateDemotable,
//    insertDemotable,
//    updateNameDemotable,
//    countDemotable,
//    initializeSQLTables
//};