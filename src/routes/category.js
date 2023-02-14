const express = require("express");
const router = express.Router();

const {
   createCategory,
   getCategories,
   getCategory,
   updateCategory,
   deleteCategory,
} = require("../controller/category");
const { requireSignin, adminMiddleware } = require("../commonMiddleware/index");
const { uploadCategoryImage } = require("../controller/imagehandler");
const { getProducts, categoryWiseProduct } = require("../controller/product");

router.get("/", getCategories, (req, res) => {
   res.render("category", { categories: req.categoryList });
});

router.get(
   "/list",
   requireSignin,
   adminMiddleware,
   getCategories,
   (req, res) => {
      res.render("admins/categories", {
         user: req.user,
         page: "category",
         categories: req.categoryList,
      });
   }
);

router.get(
   "/create",
   requireSignin,
   adminMiddleware,
   getCategories,
   (req, res) => {
      res.render("admins/addcategory", {
         user: req.user,
         page: "category",
         categoryList: req.categoryList,
      });
   }
);

router.post(
   "/create",
   requireSignin,
   adminMiddleware,
   uploadCategoryImage.single("image"),
   createCategory
);

router.get(
   "/edit/:id",
   requireSignin,
   adminMiddleware,
   getCategory,
   getCategories,
   (req, res) => {
      res.render("admins/editCategory", {
         user: req.user,
         page: "category",
         categoryList: req.categoryList,
         category: req.category,
      });
   }
);

router.post(
   "/:id",
   requireSignin,
   adminMiddleware,
   uploadCategoryImage.single("image"),
   updateCategory
);

router.get("/delete/:id", requireSignin, adminMiddleware, deleteCategory);

router.get('/product', categoryWiseProduct, (req, res) => {
   res.render('product', {products: req.productsList})
})

module.exports = router;
