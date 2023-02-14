const express = require("express");
const { getCategories } = require("../controller/category");
const { uploadProductImage } = require("../controller/imagehandler");
const {
   createProduct,
   updateProduct,
   getAllProducts,
   getProduct,
   deleteProduct,
} = require("../controller/product");
const { requireSignin, managerMiddleware } = require("../commonMiddleware");
const router = express.Router();


router.get("/", requireSignin, managerMiddleware, (req, res) => {
   res.render("managers/index", { user: req.user, page: "d" });
});

router.get(
   "/add-product",
   requireSignin,
   managerMiddleware,
   getCategories,
   (req, res) => {
      res.render("managers/addproduct", {
         user: req.user,
         page: "",
         categoryList: req.categoryList,
      });
   }
);

router.post(
   "/add-product",
   requireSignin,
   managerMiddleware,
   uploadProductImage.array("productPictures"),
   createProduct
);

router.get(
   "/products",
   requireSignin,
   managerMiddleware,
   getAllProducts,
   getCategories,
   (req, res) => {
      res.render("managers/products", {
         user: req.user,
         page: "products",
         products: req.products,
         categoryList: req.categoryList,
      });
   }
);

router.get(
   "/product/:id",
   requireSignin,
   managerMiddleware,
   getProduct,
   getCategories,
   (req, res) => {
      res.render("managers/edit-product", {
         user: req.user,
         product: req.product,
         categoryList: req.categoryList,
         page: "product",
      });
   }
);
// UPDATE PRODUCT
router.post(
   "/product/:id",
   requireSignin,
   managerMiddleware,
   uploadProductImage.array("productPictures"),
   updateProduct
);

router.get(
   "/product/delete/:id",
   requireSignin,
   managerMiddleware,
   deleteProduct
);

module.exports = router;
