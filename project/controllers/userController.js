const express = require('express');
const appService = require('../appService');
const router = express.Router();

// --- User Management Routes ---

// Create User
router.post('/users/create', async (req, res) => {
    const { accountId, year, major, password, sid, cwl } = req.body;
    try {
        const result = await appService.createUser(accountId, year, major, password, sid, cwl);
        res.json({ success: true, result });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ success: false, error: 'Failed to create user' });
    }
});

// Edit User
router.put('/users/edit/:accountId', async (req, res) => {
    const accountId = req.params.accountId;
    const { newPassword } = req.body;
    try {
        const result = await appService.editUser(accountId, newPassword);
        res.json({ success: true, result });
    } catch (error) {
        console.error(`Error editing user with ID ${accountId}:`, error);
        res.status(500).json({ success: false, error: 'Failed to edit user' });
    }
});

// Login User
router.post('/users/login', async (req, res) => {
    const { cwl, password } = req.body;
    try {
        const user = await appService.loginUser(cwl, password);
        res.json({ success: true, user });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ success: false, error: 'Failed to login user' });
    }
});

module.exports = router;