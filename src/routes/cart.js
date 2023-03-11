const express = require('express');
const cart = require('../controller/cart');
const userAuth = require('../commonMiddleware');
const order = require('../controller/order');
const product = require('../controller/product');
const { getUser } = require('../controller/user');
const user = require('../controller/user');
const payment = require('../controller/razorpay');
               
const router = express.Router();

//LOGINED USER CART
router.get(
  '/',
  userAuth.requireSignin,
  cart.getCart,
  cart.renderCart
  );
//ADD TO CART
router.get(
  '/add/:id',
  userAuth.requireSignin,
  product.getProduct,
  cart.addToCart
);
//UPDATE CART
router.post(
  '/update/:id',
  userAuth.requireSignin,
  product.getProduct,
  cart.updateCart
);
//CHECKOUT PAGE RENDER
router.get(
  '/buy/address/',
  userAuth.requireSignin,
  cart.getCart,
  product.stockAvailability,
  user.getWallet,
  cart.checkout
);
// router.post(
//   '/buy/address/',
//   userAuth.requireSignin,
//   product.latestProducts,
//   order.createOrder,
//   product.reduceStock
// );

//CREATING ORDER SESSION
router.post(
  '/buy/order/',
  userAuth.requireSignin,
  user.getWallet,
  order.createOrdersession,
  payment.createOnlineOrder,
  cart.renderOrderConfirm
);

router.get(
  '/buy/order/confirm',
  userAuth.requireSignin,
  product.latestProducts,
  payment.verifyOfflinePayment,
  order.createOrder,
  product.reduceStock
);
router.post(
  '/buy/order/confirm',
  userAuth.requireSignin,
  product.latestProducts,
  payment.verifyOnlinePayment,
  order.createOrder,
  product.reduceStock
);

//RENDER CONFIRMATION PAGE || THANKS PAGE
router.get(
  '/buy/thankyou/',
  userAuth.requireSignin,
  product.latestProducts,
  order.getlatestOrder,
  cart.renderConfirmPurchase
);
//CANCEL ORDER
router.get(
  '/order/cancel/:id',
  userAuth.requireSignin,
  order.getOrder,
  product.restoreStock,
  order.checkPaymentMethod,
  user.updateWallet,
  order.cancelOrder,
  )
//RETURN ORDER
router.get(
  '/order/return/:id',
  userAuth.requireSignin,
  order.getOrder,
  product.restoreStock,
  user.updateWallet,
  order.returnOrder

)

module.exports = router;
