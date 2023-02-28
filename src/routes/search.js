const express = require("express");
const category = require("../controller/category");
const product = require("../controller/product");
const search = require("../controller/search");
const router = express.Router();

router.get('/',category.getCategories,search.searchProduct, product.renderProducts);
module.exports = router;
