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

// Edit User
router.put('/edit/:accountId', async (req, res) => {
    const accountId = req.params.accountId;
    const { newPassword } = req.body;
    try {
        const result = await userService.editUser(accountId, newPassword);
        if (result) {
            res.json({ success: true, message: 'Password updated successfully.' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to update password.' });
        }
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ success: false, message: 'Failed to update password.' });
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { cwl, password } = req.body;
    try {
        const user = await userService.loginUser(cwl, password);
        if (user.length > 0) {
            res.json({ success: true, message: 'Login successful.', data: user });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ success: false, message: 'Failed to log in.' });
    }
});

module.exports = router;