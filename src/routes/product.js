const express = require('express');
const { getProduct, relatedProducts, testSlugProduct } = require('../controller/product');
const router = express.Router();

router.get('/:id', getProduct, relatedProducts, (req, res) => {
  res.render('common/singleProduct', {
    product: req.product,
    relatedProducts: req.relatedProducts,
  });
});

router.get('/test/:slug',testSlugProduct, relatedProducts, (req, res) => {
  res.render('common/singleProduct', {
    product: req.product,
    relatedProducts: req.relatedProducts,
  });
});

module.exports = router;
