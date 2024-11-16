const express = require('express');
const appService = require('../couponService');
const router = express.Router();

// ----------------------------------------------------------
// API endpoints for coupon:

//fetch the coupons
router.get('/fetch', async (req, res) => {
    console.log("here")
    const couponTable = await appService.fetchCoupons();
    res.json({data: couponTable});
    console.log(couponTable)
});

//update the number of uses of the select coupon
router.post('/:cid/update-num-use', async (req, res) => {
    const coupon_id = req.params.cid;
    const coupon = await appService.updateNumberUses(coupon_id);
    res.json({data: coupon});
});

// delete coupons with number of uses == 0
router.delete('/:cid/delete-used-coupon', async (req, res) => {
    const coupon_id = req.params.cid;
    await appService.deleteCoupon(coupon_id);
});

// retrieve restaurants with good coupon deals
router.get('/retrieve-good-deal-restaurant', async(req,res) => {
    const goodDealRestaurants = await appService.retrieveGoodDealRestaurants();
    res.json({data: goodDealRestaurants})
});

module.exports = router;