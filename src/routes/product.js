const express = require('express');
const product = require('../controller/product');
const router = express.Router();

router.get('/:id', product.getProduct, product.relatedProducts, product.renderSingleProduct);
router.get('/test/:slug',product.testSlugProduct, product.relatedProducts, product.renderSingleProduct);

module.exports = router;
