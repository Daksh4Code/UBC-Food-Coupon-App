const express = require('express');
const appService = require('../appService');
const router = express.Router();

// ----------------------------------------------------------
// API endpoints for coupon:

//fetch the coupons
router.get('/coupons', async (req, res) => {
    const couponTable = await appService.fetchCoupons();
    res.json({data: couponTable});
});

//update the number of uses of the select coupon
router.post('/coupons/:cid', async (req, res) => {
    const coupon_id = req.params.cid;
    const coupon = await appService.updateNumberUses(coupon_id);
    res.json({data: coupon});
});

// delete coupons with number of uses == 0
router.delete('/coupons/:cid', async (req, res) => {
    const coupon_id = req.params.cid;
    await appService.deleteCoupon(coupon_id);
});

// retrieve coupons with only one number of uses left
router.get('/coupons', async(req,res) => {
    const highDCCoupon = await appService.retrieveHighDCCoupons();
    res.json({data: highDCCoupon})
});

module.exports = router;