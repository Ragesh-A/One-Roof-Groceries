const Product = require("../models/productSchema");
const slugify = require("slugify");

exports.createProduct = (req, res) => {
   const {
      name,
      price,
      stock,
      offer,
      category,
      paymentMethod,
      singleQty,
      theme,
      productInfo,
      productFact,
      shortName,
   } = req.body;
   let productPictures = [];
   if (req.files.length > 0) {
      productPictures = req.files.map((file) => {
         return { img: file.filename };
      });
   }

   const product = new Product({
      name: name,
      slug: slugify(name),
      price,
      stock,
      offer,
      singleQty,
      productPictures,
      category,
      paymentMethod,
      theme,
      productInfo,
      productFact,
      shortName,
      createdBy: req.user._id,
   });

   product.save((err, product) => {
      if (err) return res.status(400).json({ err });
      if (product) {
         res.status(201).redirect("/manager/products");
      }
   });
};

//UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
   console.log(req.files);
   if (req.files.length > 0) {
      productPictures = req.files.map((file) => {
         return { img: file.filename };
      });
      req.body.productPictures = productPictures;
   }
   console.log(req.body);
   Product.updateOne({ _id: req.params.id }, req.body).exec((err, data) => {
      if (err) {
         console.log(err);
         res.redirect("/err");
      }
      if (data) {
         res.redirect("/manager/products");
      }
   });
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
   Product.deleteOne({ _id: req.params.id }).exec((err, data) => {
      if (err) {
         console.log(err);
         res.redirect(`/manager/product/${req.params.id}`);
      } else {
         res.redirect("/manager/products");
      }
   });
};

//GET PRODUCT
exports.getProduct = async (req, res, next) => {
   Product.findOne({ _id: req.params.id }).exec((err, data) => {
      if (err) return console.log(err);
      req.product = data;
      next();
   });
};

//TEST SLUG PRODUCT
exports.testSlugProduct = async (req, res, next) => {
   Product.findOne({ slug: req.params.slug }).exec((err, product) => {
      if (err) {
         console.log(err);
         res.redirect("/err");
      } else {
         req.product = product;
         next();
      }
   });
};

//GET ALLL PRODUCTS
exports.getAllProducts = async (req, res, next) => {
   Product.find({})
   .populate("category")
   .exec((err, products) => {
      if (err) {
         console.log(err);
         res.redirect("/manager");
      }
      if (products) {
         req.products = products;
         next();
      }
   });
};

//LATEST PRODUCTS
exports.latestProducts = async (req, res, next) => {
   Product.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .exec((err, productList) => {
         if (err) {
            console.log(err);
         }
         if (productList) {
            req.latestProducts = productList;
            next();
         }
      });
};

//RELATED PRODUCTS
exports.relatedProducts = async (req, res, next) => {
   Product.find({
      category: req.product.category,
      slug: { $ne: req.product.slug },
   })
      .limit(5)
      .exec((err, productList) => {
         if (err) {
            console.log(err);
         }
         if (productList) {
            req.relatedProducts = productList;
            next();
         }
      });
};

//CATEGORY WISE PRODUCT
exports.categoryWiseProduct = async (req, res, next) => {
   Product.find({category: req.query.q}).exec((err, productsList) => {
      if (err) {
         res.redirect('/err')
      }
      if (productsList) {
         req.productsList = productsList;
      }
      next()
   })
};
