const express = require('express');
const userAuth = require('../commonMiddleware/index');
const coupon = require('../controller/coupon');
const admin = require('../controller/admin');
const orders = require('../controller/order');
const { dashboard } = require('../controller/fetch');
const multer = require('../controller/imagehandler');
const { getemployees, getOneUser } = require('../controller/test');
const user = require('../controller/user');
const product = require('../controller/product');
const banner = require('../controller/banner');
const report = require('../controller/reports');
const router = express.Router();

/*----------------- ROUTES ----------------*/
const categoryRouter = require('./category');
/*-----------------------------------------*/

router.get(
  '/dashboard',
  userAuth.requireSignin,
  userAuth.adminMiddleware,
  getemployees,
  dashboard
);
//ADMIN PAGE RENDER
router.get(
  '/',
  userAuth.requireSignin,
  userAuth.adminMiddleware,
  product.checkStock,
  admin.renderAdminPage
);

//SALES REPORTS RENDER
router.get(
  '/sales',
  userAuth.requireSignin,
  userAuth.adminMiddleware,
  orders.salesReport,
  admin.renderSalesPage
); 
//DOWNLOAD SALES REPORTS EXCEL
router.get(
  '/sales/download-xls',
  userAuth.requireSignin,
  userAuth.adminMiddleware,
  orders.salesReport,
  report.downloadXls
);
//DOWNLOAD SALES REPORTS PDF
router.get(
  '/sales/download-pdf',
  userAuth.requireSignin,
  userAuth.adminMiddleware,
  orders.salesReport,
  report.downloadPdf
);
//EXPENSES REPORTS RENDER
router.get(
  '/expenses',
  userAuth.requireSignin,
  userAuth.adminMiddleware,
  admin.renderExpensesPage
);

//EMPLOYEES PAGE RENDER
router.get(
  '/employees',
  userAuth.requireSignin,
  userAuth.adminMiddleware,
  getemployees
);

//UPDATE EMPLOYEES
router.get(
  '/edit-employees/:_id',
  userAuth.requireSignin,
  userAuth.adminMiddleware,
  getOneUser,
  admin.renderEditEmployeePage
);
router.post(
  '/edit-employees/:_id',
  userAuth.requireSignin,
  userAuth.adminMiddleware,
  user.updateEmployee
);

//RENDER ADD EMPLOYEE PAGE
router.get(
  '/add-employee',
  userAuth.requireSignin,
  userAuth.adminMiddleware,
  admin.renderAddEmployess
);

//CREATE NEW EMPLOYEE
router.post(
  '/add-employee',
  userAuth.requireSignin,
  userAuth.adminMiddleware,
  multer.uploadProfileImage.single('profilePicture'),
  user.addUser
);

//DELETE EMPLOYEE
router.get('/delete/:id', user.deleteUser);

// RENDER ORDERs PAGE
router.get(
  '/orders',
  userAuth.requireSignin,
  userAuth.adminMiddleware,
  orders.getTotalOrders,
  admin.renderOrdersPage
);

//view SINGLE order page
router.get(
  '/view-order/:id',
  userAuth.requireSignin,
  userAuth.adminMiddleware,
  orders.getOrder,
  admin.renderViewOrder
);

//RENDER EDIT ORDER
router.get(
  '/edit-order/:id',
  userAuth.requireSignin,
  userAuth.adminMiddleware,
  orders.getOrder,
  admin.renderEditOrder
);

//UPDATE ORDER STATUS
router.post(
  '/edit-order/:id',
  userAuth.requireSignin,
  userAuth.adminMiddleware,
  orders.updateOrder
);
//MESSAGE SECTION
router.get(
  '/message',
  userAuth.requireSignin,
  userAuth.adminMiddleware,
  admin.renderMesssagePage
);

//COUPONS
router.get(
  '/coupon',
  userAuth.requireSignin,
  userAuth.adminMiddleware,
  coupon.getAllCoupons
);
//CREATE COUPONS
router.post(
  '/coupon',
  userAuth.requireSignin,
  userAuth.adminMiddleware,
  coupon.createCoupon
);
//UPDATE COUPONS
router.post(
  '/coupon/update/:id',
  userAuth.requireSignin,
  userAuth.adminMiddleware,
  coupon.updateCoupon
);
//DELETE COUPONS
router.get(
  '/coupon/delete/:id',
  userAuth.requireSignin,
  userAuth.adminMiddleware,
  coupon.deleteCoupon
);

//BANNER MANAGEMENT
router.get(
  '/layouts',
  userAuth.requireSignin,
  userAuth.managerMiddleware,
  banner.getAllBanners,
  banner.renderBannerPage
);
router.post(
  '/banner',
  userAuth.requireSignin,
  userAuth.managerMiddleware,
  multer.uploadBanner.single('image'),
  multer.resizebanner,
  banner.createBanner
);
// router.post('/banner', userAuth.requireSignin, userAuth.managerMiddleware,);
router.put(
  '/layouts/:id',
  userAuth.requireSignin,
  userAuth.managerMiddleware,
  banner.updateBanner
);
router.get(
  '/banner/delete/:id',
  userAuth.requireSignin,
  userAuth.managerMiddleware,
  banner.deleteBanner
);
//CATEGORY ROUTER
router.use('/category', categoryRouter);


module.exports = router;
