const express = require("express");
const userAuth = require("../commonMiddleware");
const cart = require("../controller/cart");
const { latestProducts } = require("../controller/product");
const { renderWishlist } = require("../controller/user");
const router = express.Router();

let accountRouter = require("./account");

router.get("/", latestProducts, (req, res) => {
   res.render("index", { latestProducts: req.latestProducts, page: "home" });
});
router.get("/err",(req, res) => {
   res.render('malfunction',{err: req.flash('err')});
});
router.use("/account", accountRouter);
router.get('/wishlist', userAuth.requireSignin, cart.getWishlist, renderWishlist);
module.exports = router;
