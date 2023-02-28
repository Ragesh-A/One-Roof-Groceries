const express = require('express');
const { get } = require('mongoose');
const userAuth = require('../commonMiddleware');
const { changePassword, updateOtp } = require('../controller/auth');
const banner = require('../controller/banner');
const cart = require('../controller/cart');
const coupon = require('../controller/coupon');
const { dashboard, getaddress, deleteAdr } = require('../controller/fetch');
const order = require('../controller/order');
const product = require('../controller/product');
const { verifyOnlinePayment } = require('../controller/razorpay');
const {
  getemployees,
  changeAuthorization,
  getUserCount,
  getEmCount,
} = require('../controller/test');

const { generateOtp } = require('../controller/validators/otp');

const router = express.Router();

router.get(
  '/adminDashboard',
  userAuth.requireSignin,
  userAuth.adminMiddleware,
  order.totalSalesReturns,
  order.getAllDelivered,
  order.weeklySales,
  order.returnsReports,
  dashboard
);
router.get('/manager/dashboard',product.productsAndCount)
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
);
router.get(
  '/userauth/:id',
  userAuth.requireSignin,
  userAuth.supportMiddleware,
  changeAuthorization
);

router.get(
  '/banner/:id',
  userAuth.requireSignin,
  userAuth.managerMiddleware,
  banner.getBanner

)

//GET ADDRESS
router.get('/test-address/:id', userAuth.requireSignin, getaddress);
router.get('/delete-address/:id', userAuth.requireSignin, deleteAdr)

//GET OTP
router.post('/getOtp', updateOtp);

//ADD TO WISHLIST
router.put('/wishlist/:id', userAuth.requireSignin, cart.addToWishlist);

//remove from wishlist
router.get('/wishlist/:id', userAuth.requireSignin);

//ONLINE PAYMENTS
router.post(
  '/online-payment/verify',
  (req, res) => {
    (req.body);
  },
  verifyOnlinePayment

)


module.exports = router;
