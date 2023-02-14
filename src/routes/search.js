const express = require("express");
const { searchProduct } = require("../controller/search");
const router = express.Router();

router.post('/',(req, res, next)=>{
  console.log(req.body);
  next();
}, searchProduct, (req, res)=>{
  res.render('product',{products: req.productList})
});

module.exports = router;
