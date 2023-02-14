const express = require('express');
const {
  requireSignin,
  adminMiddleware,
  supportMiddleware,
} = require('../commonMiddleware');
const { changePassword, updateOtp } = require('../controller/auth');
const { getCoupon } = require('../controller/coupon');
const { dashboard } = require('../controller/fetch');
const { getemployees, changeAuthorization } = require('../controller/test');
const { generateOtp } = require('../controller/validators/otp');
const router = express.Router();

router.get(
  '/adminDashboard',
  requireSignin,
  adminMiddleware,
  getemployees,
  dashboard
);

router.get('/coupon/:id', requireSignin, adminMiddleware, getCoupon);
router.get(
  '/userauth/:id',
  requireSignin,
  supportMiddleware,
  changeAuthorization
);

router.post('/getOtp', updateOtp);


module.exports = router;
