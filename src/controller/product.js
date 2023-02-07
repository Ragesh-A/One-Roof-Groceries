const Product = require('../models/productSchema');
const slugify = require('slugify');

exports.createProduct = (req, res) => {
  const { name, price, stock, offer, category, paymentMethod, singleQty } =
    req.body;
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
    createdBy: req.user._id,
  });

  product.save((err, product) => {
    if (err) return res.status(400).json({ err });
    if (product) {
      res.status(201).redirect('/manager/products');
    }
  });
};

exports.updateProduct = async (req, res) => {

  Product.updateOne({ _id: req.params.id }, req.body).exec((err, data) => {
    if(err) {
       console.log(err)
       res.redirect('/err')
      };
    if(data){
      res.redirect('/manager/products')
    }
  });
};

exports.deleteProduct = async (req, res)=>{
  Product.deleteOne({_id: req.params.id}).exec((err, data)=>{
    if(err){
      console.log(err);
      res.redirect(`/manager/product/${req.params.id}`)
    }
    else{
      res.redirect('/manager/products')
    }
  })
}

exports.getProduct = async(req, res, next)=>{
  Product.findOne({_id: req.params.id}).exec((err, data)=>{
    if(err) return console.log(err);
    req.product = data;
    next()
  })
}

exports.getAllProducts = async (req, res, next) => {
  Product.find({}).populate('category').exec((err, products)=>{
    if(err){
      console.log(err);
      res.redirect('/manager')
    }
    if(products){
      console.log(products);
      req.products = products;
    next();
    }
    
  });
};

exports.latestProducts = async(req, res, next)=>{

  let currentTime = new Date();
  Product.find().sort({timestamp: -1}).limit(5).exec((err, productList)=>{
    if(err){
      console.log(err);
    }
    if(productList){
      req.latestProducts = productList;
      next()
    }
  })
}