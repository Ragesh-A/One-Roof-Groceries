const express = require('express');
const router = express.Router();
const category = require('../controller/category');
const { requireSignin, adminMiddleware } = require('../commonMiddleware/index');
const { uploadCategoryImage } = require('../controller/imagehandler');
const product = require('../controller/product');

router.get('/', category.getCategories, category.renderCategories);

//ADMIN PAGE CATEGORY RENDER
router.get(
  '/list',
  requireSignin,
  adminMiddleware,
  category.getCategories,
  category.adminRenderCategories
);

//CREATE CATEGORY PAGE RENDER
router.get(
  '/create',
  requireSignin,
  adminMiddleware,
  category.getCategories,
  category.renderCreateCategory
);
//CREATE CATEGORY
router.post(
  '/create',
  requireSignin,
  adminMiddleware,
  uploadCategoryImage.single('image'),
  category.createCategory
);

//EDIT CATEGORY PAGE RENDER
router.get(
  '/edit/:id',
  requireSignin,
  adminMiddleware,
  category.getCategory,
  category.getCategories,
  category.renderEditCategory
);

//EDIT CATEGORY
router.post(
  '/:id',
  requireSignin,
  adminMiddleware,
  uploadCategoryImage.single('image'),
  category.updateCategory
);

//DELETE CATEGORY
router.get(
  '/delete/:id',
  requireSignin,
  adminMiddleware,
  category.deleteCategory
);

router.get('/product', product.categoryWiseProduct,category.getCategories,product.renderProducts);

module.exports = router;
