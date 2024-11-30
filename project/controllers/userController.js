// UNUSED

/*
const express = require('express');
const userService = require('../userService');
const router = express.Router();

// --- User Management routes ---

// Create User
router.post('/create', async (req, res) => {
    const { accountId, year, major, password, sid, cwl } = req.body;
    try {
        const result = await userService.createUser(accountId, year, major, password, sid, cwl);
        if (result) {
            res.json({ success: true, message: 'User created successfully.' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to create user.' });
        }
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ success: false, message: 'Failed to create user.' });
    }
});

// View all users
router.get('/view', async (req, res) => {
    try {
        const users = await userService.viewUsers();
        res.json({ data: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch users.' });
    }
});

// View all account IDs
router.get('/accountIds', async (req, res) => {
    try {
        const accountIds = await userService.getAccountIds();
        res.json({ data: accountIds });
    } catch (error) {
        console.error('Error fetching account IDs:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch account IDs.' });
    }
});

module.exports = router;

*/