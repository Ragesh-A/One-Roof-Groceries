const express = require("express");
const { searchProduct } = require("../controller/search");
const router = express.Router();

router.get('/',searchProduct, (req, res)=>{
  res.render('product',{products: req.productList})
});


module.exports = router;
