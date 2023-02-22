const express = require('express');
const router = express.Router();
const admin = require('../controller/admin');
const userAuth = require('../commonMiddleware');
const product = require('../controller/product');
const { getCategories } = require('../controller/category');
const { uploadProductImage, resizeProductImage } = require('../controller/imagehandler');
const multer = require('../controller/imagehandler');

//mANAGER DASHBOARD
router.get('/',
 userAuth.requireSignin, 
 userAuth.managerMiddleware, 
 admin.renderMangerDashboard);
//RENDER ALL PRODUCTS
router.get(
   '/products',
   userAuth.requireSignin,
   userAuth.managerMiddleware,
   product.getAllProducts,
   getCategories,
   admin.renderAdminProducts
 );
//ADD PRODUCT
router.get(
   '/add-product',
   userAuth.requireSignin,
   userAuth.managerMiddleware,
   getCategories,
   admin.renderAddProduct
 );
router.post(
  '/add-product',
  userAuth.requireSignin,
  userAuth.managerMiddleware,
  multer.uploadProductImage.array('productPictures'),
  multer.resizeProductImage,
  product.createProduct
);
//RENDER EDIT PRODUCT
router.get(
  '/product/:id',
  userAuth.requireSignin,
  userAuth.managerMiddleware,
  product.getProduct,
  getCategories,
  admin.renderEditProduct
);
// UPDATE PRODUCT
router.post(
  '/product/:id',
  userAuth.requireSignin,
  userAuth.managerMiddleware,
  uploadProductImage.array('productPictures'),
  product.updateProduct
);

//DELDETE PRODUCT
router.get(
  '/product/delete/:id',
  userAuth.requireSignin,
  userAuth.managerMiddleware,
  product.deleteProduct
);

module.exports = router;
