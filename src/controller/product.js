const Product = require('../models/productSchema');
const slugify = require('slugify');
const { request } = require('express');

exports.createProduct = (req, res) => {
  const {
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
  let name = req.body.name.toLowerCase();
  let productPictures = [];
  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }

  try {
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
      if (err) {
        req.flash('err', `Product creation failed ${err.message}`);
        res.status(201).redirect('/manager/add-product');
      }
      if (product) {
        req.flash('success', 'new product created Successfully');
        res.status(201).redirect('/manager/products');
      }
    });
  } catch (error) {
    req.flash('err', 'server error due to malfunction request');
    res.redirect('/err');
  }
};

//UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    if (req.files.length > 0) {
      productPictures = req.files.map((file) => {
        return { img: file.filename };
      });
      req.body.productPictures = productPictures;
    }
    Product.updateOne({ _id: req.params.id }, req.body).exec((err, data) => {
      if (err) {
        console.log(err);
        req.flash('err', 'Product not updated');
        res.redirect(`/manager/product/${req.params.id}`);
      }
      if (data) {
        req.flash('success', 'Product updated Successfully');
        res.redirect('/manager/products');
      }
    });
  } catch (error) {
    req.flash('error', 'update product failed');
    res.redirect('/err');
  }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  Product.deleteOne({ _id: req.params.id }).exec((err, data) => {
    if (err) {
      console.log(err);
      req.flash('err', 'Product not deleted');
      res.redirect(`/manager/product/${req.params.id}`);
    } else {
      req.flash('success', 'Product deleted successfully');
      res.redirect('/manager/products');
    }
  });
};

//GET PRODUCT
exports.getProduct = async (req, res, next) => {
  try {
    Product.findOne({ _id: req.params.id }).exec((err, data) => {
      if (err) return res.redirect('/');
      req.product = data;
      next();
    });
  } catch (error) {
    
  }
};

//TEST SLUG PRODUCT
exports.testSlugProduct = async (req, res, next) => {
  Product.findOne({ slug: req.params.slug }).exec((err, product) => {
    if (err) {
      console.log(err);
      res.redirect('/err');
    } else {
      req.product = product;
      next();
    }
  });
};

//GET ALLL PRODUCTS
exports.getAllProducts = async (req, res, next) => {
  Product.find({})
    .populate('category')
    .exec((err, products) => {
      if (err) {
        console.log(err);
        res.redirect('/manager');
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
  Product.find({ category: req.query.q }).exec((err, productsList) => {
    if (err) {
      req.productsList =[]
    }
    if (productsList) {
      req.productList = productsList;
    }
    next();
  });
};

//STOCK DECREASE WHILE PLACE ORDER
exports.reduceStock = async (req, res) => {
  const productList = req.session.userOrder.products;

  productList.forEach(async (product) => {
    const reduced = await Product.updateOne(
      { _id: product.product_id },
      { $inc: { stock: -Math.abs(product.quantity) } },
      { new: true }
    );
    
  });
};

//LOW STOCK PRODUCT
exports.checkStock = async (req, res, next) => {
  const lowStock = await Product.find({ stock: { $lte: 10 } });
  if (!lowStock) return console.log('somrthing stock');

  req.lowStock = lowStock;
  next();
};

// STOCK AVAILABILITY WHILE CHECKOUT
exports.stockAvailability = async (req, res, next) => {
  const userCart = req.cart;
  let message = [];

  try {
    
      userCart.Items.forEach(item => {
        if (item.product.stock < item.quantity){
          message.push(`${item.product.name} only left ${item.product.stock}`);
        }
      });

      if(message.length == 0){
        return next();
      }

      req.flash('err', message)
      res.redirect('/cart')
  } catch (error) {
    req.flash('err', error.message)
    res.redirect('/err')
  }
};

//RESTORE QUANTITY AFTER CANCEL THE ORDER
exports.restoreStock = async (req, res, next) => {
  const userOrder = req.order.products;
  let err = "";
  
  try {
    
    userOrder.forEach(async (product) => {
      const updated = await Product.updateOne(
      {_id: product.product_id},
      {$inc : {stock: product.quantity}}
      )
      if(!updated) {
        req.flash('err', 'something went wrong while restoreing quantity')
        return res.redirect('/err')
      }
      
    });

    next();

  } catch (error) {
    req.flash('err', error)
    return res.redirect('/err')
  }
}

exports.productsAndCount = async function (req, res, next){
  const product = await Product.find({},{shortName: 1, stock: 1, _id:0})
  if (!product) return res.json({product: []}) = [];
  return res.json({product}) ;
}

exports.renderProducts = async function (req, res){
  res.render('product',{products: req.productList, categoryList: req.categoryList})
}
exports.renderSingleProduct = async function (req, res){
  res.render('common/singleProduct', {
    product: req.product,
    relatedProducts: req.relatedProducts,
  });
}

