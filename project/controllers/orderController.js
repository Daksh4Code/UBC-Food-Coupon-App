const express = require('express');
const orderService = require('../orderService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await orderService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/demotable', async (req, res) => {
    const tableContent = await orderService.fetchDemotableFromDb();
    res.json({data: tableContent});
});

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await orderService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await orderService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await orderService.updateNameDemotable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-demotable', async (req, res) => {
    const tableCount = await orderService.countDemotable();
    if (tableCount >= 0) {
        res.json({
            success: true,
            count: tableCount
        });
    } else {
        res.status(500).json({
            success: false,
            count: tableCount
        });
    }
});

router.get('/rotd', async (req, res) => {
    const visitors = await orderService.getROTDVisitors()
    res.json({
            result: visitors
        });
});

router.get('/costs', async (req, res) => {
    const orders = await orderService.getOrderCosts()
    res.json({
            result: orders
        });
});

router.get('/rotdnames', async (req, res) => {
    const rotd = await orderService.getROTD()
    res.json({
            result: rotd
        });
});

// FUNCTIONALITY FOR ORDER:
//retrieve all restaurants
router.get('/get_restaurants', async (req, res) => {
    const restaurants = await orderService.getRestaurants();
    res.json({ data: restaurants })
});

// Get the branch associated with the restaurant
router.get('/:rid/get_res_branch', async (req, res) => {
    try {
        const res_id = req.params.rid;
        const restaurant_branches = await orderService.getRestaurantBranch(res_id);
        console.log("controller", restaurant_branches)
        res.json({ data: restaurant_branches });
    } catch (error) {
        console.log("error fetching selected coupons");
    }
});

// Get the Coupon associated with selected Branch
router.get('/:bid/get_coupon_branch', async (req, res) => {
    const branch_id = req.params.bid;
    const branch_coupon = await orderService.getCouponBranch(branch_id);
    res.json({ data: branch_coupon })
});

// Get the Coupon associated with selected Branch
router.get('/:bid/get-foods', async (req, res) => {
    const branch_id = req.params.bid;
    const foods = await orderService.getRestaurantFood(branch_id);
    res.json({ data: foods })
});

router.post("/create-order", async (req, res) => {
    const { oid, paymethod, cid, bid, aid, sid, fid, quantity } = req.body;
    const postResult = await orderService.createOrder(oid, paymethod, cid, bid, aid, sid, fid, quantity);
    if (postResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


module.exports = router;