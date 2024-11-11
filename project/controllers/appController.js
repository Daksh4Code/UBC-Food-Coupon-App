const express = require('express');
const appService = require('../appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.

router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({data: tableContent});
});

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post('/initialize-sql-tables', async (req, res) => {
    const initializeTables = await appService.initializeSQLTables('db/init.sql');
     if (initializeTables) {
            res.json({ success: true });
        } else {
            res.status(500).json({ success: false });
     }
});

// --- User Management Routes ---

router.post('/create-account', async (req, res) => {
    const { accountId, year, major, password, sid, cwl } = req.body;
    const sql = require('./user_queries.sql');
    await appService.withOracleDB(async (connection) => {
        try {
            await connection.execute(
                sql,
                [accountId, year, major, password, sid, cwl],
                { autoCommit: true }
            );
            res.json({success: true});
        } catch (error) {
            console.error('Error creating account:', error);
            res.status(500).json({success: false, error: 'Failed to create account'});
        }
    });
});

router.put('/edit-account/:accountId', async (req, res) => {
    const accountId = req.params.accountId;
    const {newPassword} = req.body;
    const sql = require('./user_queries.sql');
    await appService.withOracleDB(async (connection) => {
        try {
            await connection.execute(
                sql,
                [newPassword, accountId],
                {autoCommit: true}
            );
            res.json({success: true});
        } catch (error) {
            console.error('Error updating account:', error);
            res.status(500).json({success: false, error: 'Failed to update account'});
        }
    });
});

router.post('/login', async (req, res) => {
    const {cwl, password} = req.body;
    const sql = require('./user_queries.sql');
    await appService.withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(sql, [cwl, password]);
            if (result.rows.length > 0) {
                res.json({success: true, user: result.rows[0]});
            } else {
                res.status(401).json({success: false, error: 'Invalid credentials'});
            }
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({success: false, error: 'Failed to login'});
        }
    });
});

// --- Feedback Management Routes ---

router.post('/submit-feedback', async (req, res) => {
    const {accountId, sid, order_date, branchId, rating} = req.body;
    const sql = require('./feedback_queries.sql');
    await appService.withOracleDB(async (connection) => {
        try {
            await connection.execute(
                sql,
                [accountId, sid, order_date, branchId, rating],
                {autoCommit: true}
            );
            res.json({success: true});
        } catch (error) {
            console.error('Error submitting feedback:', error);
            res.status(500).json({success: false, error: 'Failed to submit feedback'});
        }
    });
});

router.put('/update-feedback', async (req, res) => {
    const {accountId, sid, order_date, branchId, newRating} = req.body;
    const sql = require('./feedback_queries.sql');
    await appService.withOracleDB(async (connection) => {
        try {
            await connection.execute(
                sql,
                [newRating, accountId, sid, order_date, branchId],
                {autoCommit: true}
            );
            res.json({success: true});
        } catch (error) {
            console.error('Error updating feedback:', error);
            res.status(500).json({success: false, error: 'Failed to update feedback'});
        }
    });
});

router.get('/view-feedback/:accountId', async (req, res) => {
    const accountId = req.params.accountId;
    const sql = require('./feedback_queries.sql');
    await appService.withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(sql, [accountId]);
            res.json({success: true, feedback: result.rows});
        } catch (error) {
            console.error('Error viewing feedback:', error);
            res.status(500).json({success: false, error: 'Failed to view feedback'});
        }
    });
});

router.get('/best-rated-branch', async (req, res) => {
    const sql = require('./feedback_queries.sql');
    await appService.withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(sql);
            res.json({success: true, branchId: result.rows[0].branch_id});
        } catch (error) {
            console.error('Error finding best-rated branch:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to find best-rated branch'
            });
        }
    });
});

module.exports = router;



