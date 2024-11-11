const express = require('express');
const appService = require('../appService');
const router = express.Router();

// --- User Management Routes ---

// Create User
router.post('/users/create', async (req, res) => {
    const { accountId, year, major, password, sid, cwl } = req.body;
    const result = await appService.createUser(accountId, year, major, password, sid, cwl);
    res.json({ result });
});

// Edit User
router.put('/users/edit/:accountId', async (req, res) => {
    const accountId = req.params.accountId;
    const { newPassword } = req.body;
    const result = await appService.editUser(accountId, newPassword);
    res.json({ result });
});

// Login User
router.post('/users/login', async (req, res) => {
    const { cwl, password } = req.body;
    const user = await appService.loginUser(cwl, password);
    res.json({ user });
});

module.exports = router;