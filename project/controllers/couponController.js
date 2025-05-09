const express = require('express');
const appService = require('../couponService');
const router = express.Router();

// ----------------------------------------------------------
// API endpoints for coupon:

//fetch the coupons
router.get('/fetch', async (req, res) => {
    const couponTable = await appService.fetchCoupons();
    res.json({data: couponTable});
});

//fetch the selected coupons
router.post('/fetch-selected', async (req, res) => {
    const { query } = req.body;
    try {
            const couponTable = await appService.fetchSelectedCoupons(query);
            res.json(couponTable);
        } catch (error) {
            res.send("error fetching selected coupons");
        }
});

//project the selected table attributes
router.post('/project', async (req, res) => {
    const { query } = req.body;
    try {
            const couponTable = await appService.projectCoupons(query);
            res.json(couponTable);

        } catch (error) {
            res.send("error projecting attributes");
        }
});


// retrieve restaurants with good coupon deals
router.get('/retrieve-good-deal-restaurant', async(req,res) => {
    const goodDealRestaurants = await appService.retrieveGoodDealRestaurants();
    res.json({data: goodDealRestaurants})
});

// FUNCTIONALITY FOR ORDER:
//retrieve all restaurants
router.get('/get_restaurants', async(req,res) => {
    const restaurants = await appService.getRestaurants();
    res.json({data: restaurants})
});

// Get the branch associated with the restaurant
router.get('/:rid/get_res_branch', async(req,res) => {
   try{
       const res_id = req.params.rid;
       const restaurant_branches = await appService.getRestaurantBranch(res_id);
       console.log("controller", restaurant_branches)
       res.json({data: restaurant_branches});
   }catch(error) {
       console.log("error fetching selected coupons");
   }
});

// Get the Coupon associated with selected Branch
router.get('/:bid/get_coupon_branch', async(req,res) => {
   const branch_id = req.params.bid;
   const branch_coupon = await appService.getCouponBranch(branch_id);
   res.json({data: branch_coupon})
});

//update the number of uses of the select coupon
router.put('/:cid/update-num-use', async (req, res) => {
    const coupon_id = req.params.cid;
    const coupon = await appService.updateNumberUses(coupon_id);
    res.json({data: coupon});
});

// delete coupons with number of uses == 0
router.delete('/del-used-coupon', async (req, res) => {
    const deleted_coupons = await appService.deleteCoupon();
});

module.exports = router;