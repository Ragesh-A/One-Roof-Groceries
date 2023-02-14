const express = require("express");
const { requireSignin } = require("../commonMiddleware");
const { latestProducts } = require("../controller/product");
const router = express.Router();

let accountRouter = require("./account");

router.get("/", latestProducts, (req, res) => {
   res.render("index", { latestProducts: req.latestProducts });
});

router.use("/account", accountRouter);
router.get("/singleproduct", (req, res) => {
   res.render("common/singleproduct");
});

module.exports = router;
