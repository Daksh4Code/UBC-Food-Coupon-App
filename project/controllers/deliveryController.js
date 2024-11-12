const express = require('express');
const deliveryService = require('../deliveryService');
const router = express.Router();

// --- User Management Routes ---

// Create Delivery Order
router.post('/delivery/create', async (req, res) => {
    const { order_id,total_cost,order_date,payment_method,promo_code,coupon_id,branch_id,account_id,sid,delivery_cost,delivery_status,delivery_time } = req.body;
    const result = await deliveryService.generateDelivery(order_id,total_cost,order_date,payment_method,promo_code,coupon_id,branch_id,account_id,sid,delivery_cost,delivery_status,delivery_time);
    res.json({ result });
});

// Update Status for Order Delivery
router.put('/delivery/update/:orderID', async (req, res) => {
    const orderID = req.params.orderID;
    const { newStatus } = req.body;
    const result = await deliveryService.updateStatus(orderID, newStatus);
    res.json({ result });
});

// Get details
router.get('/delivery/update/:orderID', async (req, res) => {
    const orderID = req.params.orderID;
    const result = await deliveryService.getOrderDetails(orderID);
    res.json({ result });
});

module.exports = router;