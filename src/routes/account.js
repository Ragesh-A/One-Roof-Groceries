const express = require('express');
const order = require('../controller/order');
const account = require('../controller/account');
const userAuth = require('../commonMiddleware/index');
const auth = require('../controller/auth');
const validate = require('../controller/validators/userAuth');
const user = require('../controller/user');
const {
  uploadProfileImage,
  resizeImage,
} = require('../controller/imagehandler');
// const { otpVerification } = require('../controller/validators/otp')
const { route } = require('./category');
const router = express.Router();

//ACCOUNT PAGE
router.get('/', userAuth.requireSignin, user.getUser, account.renderAccount);

// ACCOUNT EDIT
router
  .route('/edit')
  .get(userAuth.requireSignin, user.getUser, account.renderEditAccount)
  .post(
    userAuth.requireSignin,
    uploadProfileImage.single('profilePicture'),
    resizeImage,
    user.updateProfile
  );

// ACCOUNT SIGIN
router.get('/signin', account.renderLogin);
router.post(
  '/signin',
  validate.validateSigninRequest,
  validate.isValidated,
  auth.signin
);

//SIGNUP
router.get('/signup', account.renderSignup);
router.post(
  '/signup',
  validate.validateSignupRequest,
  validate.isValidated,
  auth.signup
);

//OTP VERIFICATION
router.post('/verify', auth.createAccount);
router.post('/verifyOtp', auth.verifyPassword);

//CHANGE PASSWORD
router.post('/password', auth.changePassword);

//SIGNOUT
router.get('/signout', userAuth.requireSignin, auth.signout);
//  ADD NEW ADDRESS
router.post('/new-address', userAuth.requireSignin, user.newAddress);
//ORDERS
router.get(
  '/my-orders',
  userAuth.requireSignin,
  order.getUserOrders,
  account.renderMyOrder
);

//WALLET
router.get(
  '/my-wallet',
  userAuth.requireSignin,
  user.getWallet,
  account.renderWallet
);
module.exports = router;
