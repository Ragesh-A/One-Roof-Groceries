const express = require('express');
const cart = require('../controller/cart');
const user = require('../controller/user');
const userAuth = require('../commonMiddleware');
const product = require('../controller/product');
const router = express.Router();

const apiRouter = require('./api');
const otpRouter = require('./test');
const cartRouter = require('./cart');
const adminRouter = require('./admin');
const accountRouter = require('./account');
const categoryRouter = require('./category');
const messageRouter = require('./message');
const managerRouter = require('./manager');
const supportRouter = require('./support');
const productRouter = require('./product');
const searchRouter = require('./search');
const banner = require('../controller/banner');

router.get('/', product.latestProducts,cart.cartCount, banner.getAllBanners,user.renderHome);
router.use('/api', apiRouter);
router.use('/otp', otpRouter);
router.use('/cart', cartRouter);
router.use('/admin', adminRouter);
router.use('/search', searchRouter);
router.use('/account', accountRouter);
router.use('/product', productRouter);
router.use('/contact', messageRouter);
router.use('/manager', managerRouter);
router.use('/support', supportRouter);
router.use('/category', categoryRouter);
router.get('/err', user.renderErr);

router.get(
  '/wishlist',
  userAuth.requireSignin,
  cart.getWishlist,
  user.renderWishlist
);

module.exports = router;
