const express = require('express');
const { get } = require('mongoose');
const userAuth = require('../commonMiddleware');
const { changePassword, updateOtp } = require('../controller/auth');
const cart = require('../controller/cart');
const coupon = require('../controller/coupon');
const { dashboard, getaddress } = require('../controller/fetch');
const order = require('../controller/order');
const { getemployees, changeAuthorization, getUserCount, getEmCount } = require('../controller/test');
const { generateOtp } = require('../controller/validators/otp');
const router = express.Router();

router.get(
  '/adminDashboard',
  userAuth.requireSignin,
  userAuth.adminMiddleware,
  getUserCount,
  getEmCount,
  order.getAllDelivered,
  dashboard
);

router.get(
  '/coupon/:id',
  userAuth.requireSignin,
  userAuth.adminMiddleware,
  coupon.getCoupon
);
router.post(
  '/check-coupon',
  userAuth.requireSignin,
  cart.getCart,
  cart.getCartAmount,
  coupon.checkCoupon
)
router.get(
  '/userauth/:id',
  userAuth.requireSignin,
  userAuth.supportMiddleware,
  changeAuthorization
);
//GET ADDRESS
router.get(
  '/test-address/:id',
  userAuth.requireSignin,
  getaddress
);

//GET OTP
router.post('/getOtp', updateOtp)

//ADD TO WISHLIST
router.put('/wishlist/:id', userAuth.requireSignin,cart.addToWishlist)
//remove from wishlist
router.get('/wishlist/:id', userAuth.requireSignin)
module.exports = router;
