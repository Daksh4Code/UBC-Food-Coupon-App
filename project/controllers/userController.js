const express = require('express');
const appService = require('../appService');
const userQueries = require('../user_queries.sql'); // Ensure correct path to user queries
const feedbackQueries = require('../feedback_queries.sql'); // Ensure correct path to feedback queries
const router = express.Router();

// Create account route
router.post('/create-account', async (req, res) => {
    const { accountId, year, major, password, sid, cwl } = req.body;
    await appService.withOracleDB(async (connection) => {
        try {
            await connection.execute(
                userQueries.createAccount, // Ensure appropriate query in your SQL file
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

// Edit account route
router.put('/edit-account/:accountId', async (req, res) => {
    const accountId = req.params.accountId;
    const { newPassword } = req.body;
    await appService.withOracleDB(async (connection) => {
        try {
            await connection.execute(
                userQueries.updateAccount, // Ensure appropriate query in your SQL file
                { newPassword: newPassword, account_id: accountId },
                { autoCommit: true }
            );
            res.json({ success: true });
        } catch (error) {
            console.error('Error updating account:', error);
            res.status(500).json({ success: false, error: 'Failed to update account' });
        }
    });
});

// Login route
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

module.exports = router;