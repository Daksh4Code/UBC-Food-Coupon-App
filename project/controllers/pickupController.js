const express = require('express');
const pickupService = require('../pickupService');
const router = express.Router();

// --- User Management Routes ---

// Create Pickup Order
router.post('/pickup/create', async (req, res) => {
    const { order_id,total_cost,order_date,payment_method,promo_code,coupon_id,branch_id,account_id,sid,pickup_status,pickup_time } = req.body;
    const result = await pickupService.generatePickup(order_id,total_cost,order_date,payment_method,promo_code,coupon_id,branch_id,account_id,sid,pickup_status,pickup_time);
    res.json({ result });
});

// Update Status for Order Pickup
router.put('/pickup/update/:orderID', async (req, res) => {
    const orderID = req.params.orderID;
    const { newStatus } = req.body;
    const result = await pickupService.updateStatus(orderID, newStatus);
    res.json({ result });
});

// Get details
router.get('/pickup/update/:orderID', async (req, res) => {
    const orderID = req.params.orderID;
    const result = await pickupService.getOrderDetails(orderID);
    res.json({ result });
});

module.exports = router;