const Product = require("../models/productSchema");

exports.searchProduct = async(req, res, next) => {
  Product.find({$text: {
    $search: req.body.search
  }}).exec((err, productList) => {
    if (err) {
      return res.status(500).json({
        error: err
      })
    }if (productList){
      req.productList = productList;
      next();
    }
    else{
      res.send("no result")
    }
  })
}