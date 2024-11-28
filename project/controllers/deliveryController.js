const express = require('express');
const deliveryService = require('../deliveryService');
const router = express.Router();

// --- User Management Routes ---

// Create Delivery Order
router.post('/create', async (req, res) => {
    const { total_cost, order_date, payment_method, promo_code, coupon_id, branch_id, account_id, sid, delivery_cost, delivery_status, delivery_time } = req.body;
    const result = await deliveryService.generateDelivery(total_cost, order_date, payment_method, promo_code, coupon_id, branch_id, account_id, sid, delivery_cost, delivery_status, delivery_time);
    res.json({ result });
});

// Update Status for Order Delivery
router.put('/update/:orderID', async (req, res) => {
    const orderID = req.params.orderID;
    const { newStatus } = req.body;
    const result = await deliveryService.updateStatus(orderID, newStatus);
    res.json({ result });
});

// Get details
router.get('/update/:orderID', async (req, res) => {
    const orderID = req.params.orderID;
    const result = await deliveryService.getOrderDetails(orderID);
    res.json({ result });
});

// FUNCTIONALITY FOR ORDER:
//retrieve all restaurants
router.get('/get_restaurants', async (req, res) => {
    const restaurants = await appService.getRestaurants();
    res.json({ data: restaurants })
});

// Get the branch associated with the restaurant
router.get('/:rid/get_res_branch', async (req, res) => {
    try {
        const res_id = req.params.rid;
        const restaurant_branches = await appService.getRestaurantBranch(res_id);
        console.log("controller", restaurant_branches)
        res.json({ data: restaurant_branches });
    } catch (error) {
        console.log("error fetching selected coupons");
    }
});

// Get the Coupon associated with selected Branch
router.get('/:bid/get_coupon_branch', async (req, res) => {
    const branch_id = req.params.bid;
    const branch_coupon = await appService.getCouponBranch(branch_id);
    res.json({ data: branch_coupon })
});

module.exports = router;