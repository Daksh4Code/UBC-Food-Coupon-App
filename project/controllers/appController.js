const express = require('express');
const appService = require('../utils/appService'); // Correct relative path from controllers to utils
const userQueries = require('../db/user_queries.sql'); // Correct path to user queries
const feedbackQueries = require('../db/feedback_queries.sql'); // Correct path to feedback queries

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.

router.get('/check-db-connection', async (req, res) => {
    try {
        const isConnect = await appService.testOracleConnection();
        res.send(isConnect ? 'connected' : 'unable to connect');
    } catch (error) {
        console.error('DB connection error:', error);
        res.status(500).send('DB connection error');
    }
});

router.get('/demotable', async (req, res) => {
    try {
        const tableContent = await appService.fetchDemotableFromDb();
        res.json({ data: tableContent });
    } catch (error) {
        console.error('Error fetching demo table:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch demo table' });
    }
});

router.post("/initiate-demotable", async (req, res) => {
    try {
        const initiateResult = await appService.initiateDemotable();
        res.json({ success: !!initiateResult });
    } catch (error) {
        console.error('Error initiating demo table:', error);
        res.status(500).json({ success: false, error: 'Failed to initiate demo table' });
    }
});

router.post('/initialize-sql-tables', async (req, res) => {
    try {
        const initializeTables = await appService.initializeSQLTables('db/init.sql');
        res.json({ success: !!initializeTables });
    } catch (error) {
        console.error('Error initializing SQL tables:', error);
        res.status(500).json({ success: false, error: 'Failed to initialize SQL tables' });
    }
});

// --- User Management Routes ---

router.post('/create-account', async (req, res) => {
    const { accountId, year, major, password, sid, cwl } = req.body;
    await appService.withOracleDB(async (connection) => {
        try {
            await connection.execute(
                userQueries.createAccount, // Use appropriate query from your SQL file
                { account_id: accountId, year, major, password, sid, cwl },
                { autoCommit: true }
            );
            res.json({ success: true });
        } catch (error) {
            console.error('Error creating account:', error);
            res.status(500).json({ success: false, error: 'Failed to create account' });
        }
    });
});

router.put('/edit-account/:accountId', async (req, res) => {
    const accountId = req.params.accountId;
    const { newPassword } = req.body;
    await appService.withOracleDB(async (connection) => {
        try {
            await connection.execute(
                userQueries.updateAccount, // Use appropriate query from your SQL file
                { newPassword, accountId },
                { autoCommit: true }
            );
            res.json({ success: true });
        } catch (error) {
            console.error('Error updating account:', error);
            res.status(500).json({ success: false, error: 'Failed to update account' });
        }
    });
});

router.post('/login', async (req, res) => {
    const { cwl, password } = req.body;
    await appService.withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                userQueries.login,
                { cwl, password }
            );
            if (result.rows.length > 0) {
                res.json({ success: true, user: result.rows[0] });
            } else {
                res.status(401).json({ success: false, error: 'Invalid credentials' });
            }
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ success: false, error: 'Failed to login' });
        }
    });
});

// --- Feedback Management Routes ---

router.post('/submit-feedback', async (req, res) => {
    const { accountId, sid, order_date, branchId, rating } = req.body;
    await appService.withOracleDB(async (connection) => {
        try {
            await connection.execute(
                feedbackQueries.submitFeedback, // Use appropriate query from your SQL file
                { accountId, sid, order_date, branchId, rating },
                { autoCommit: true }
            );
            res.json({ success: true });
        } catch (error) {
            console.error('Error submitting feedback:', error);
            res.status(500).json({ success: false, error: 'Failed to submit feedback' });
        }
    });
});

router.put('/update-feedback', async (req, res) => {
    const { accountId, sid, order_date, branchId, newRating } = req.body;
    await appService.withOracleDB(async (connection) => {
        try {
            await connection.execute(
                feedbackQueries.updateFeedback, // Use appropriate query from your SQL file
                { newRating, accountId, sid, order_date, branchId },
                { autoCommit: true }
            );
            res.json({ success: true });
        } catch (error) {
            console.error('Error updating feedback:', error);
            res.status(500).json({ success: false, error: 'Failed to update feedback' });
        }
    });
});

router.get('/view-feedback/:accountId', async (req, res) => {
    const accountId = req.params.accountId;
    await appService.withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(feedbackQueries.viewFeedback, { accountId });
            res.json({ success: true, feedback: result.rows });
        } catch (error) {
            console.error('Error viewing feedback:', error);
            res.status(500).json({ success: false, error: 'Failed to view feedback' });
        }
    });
});

router.get('/best-rated-branch', async (req, res) => {
    await appService.withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(feedbackQueries.bestRatedBranch);
            res.json({ success: true, branchId: result.rows[0].branch_id });
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