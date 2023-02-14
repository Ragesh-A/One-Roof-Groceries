const express = require("express");
const { requireSignin, siginOrNot } = require("../commonMiddleware");
const { addToCart, getCart, updateCart, checkout } = require("../controller/cart");
const { createOrder } = require("../controller/order");
const { getProduct, latestProducts } = require("../controller/product");
const { getUser } = require("../controller/user");
const router = express.Router();

//LOGINED USER CART
router.get("/",requireSignin, getCart, (req, res) => {
  res.render('common/cart', { cartList: req.cart })
});

router.get("/add/:id", requireSignin, getProduct, addToCart);
router.post("/update/:id", requireSignin, getProduct, updateCart);
router.post("/delete/:id", requireSignin, getProduct, );
router.get('/buy/address/',requireSignin, getCart, checkout)
router.post('/buy/address/',requireSignin,latestProducts,createOrder) 
  
router.get('/buy/thankyou/',requireSignin, latestProducts,(req,res)=>{
  res.render('common/thankyou',{ cartList: false , latestProducts: req.latestProducts  });
})
module.exports = router;
