const Product = require('../models/productSchema');

const searchProduct = async (req, res, next) => {
  let searchq = req.query.q ? req.query.q : '';
  let page = req.query.page ? parseInt(req.query.page) : 1;
  let limit = req.query.limit < 12 ? parseInt(req.query.limit) : 12;
  let category = req.query.category || '';
  let max = req.query.max || 5000;
  let min = req.query.min || 0;

  let price = { $gt: min, $lt: max };
  let search = { $regex: searchq, $options: 'i' };
  let result = [];
  let pages = 0
  try {
    //IF CTEFORY NOT SPECIFIED
    if (category == '') {
      result = await Product.find({
        $or: [{ productInfo: search }, { name: search }],
        price: price,
      })
        .skip((page - 1) * 12)
        .limit(limit);
       //GET TOTAL LEGTH OF PRODUCT
        pages = await Product.find({
          $or: [{ productInfo: search }, { name: search }],
          price: price,
        }).count();
        pages = pages/12
    }
    //IF CATEGORY SPECIFIED
    if (category != '') {
      result = await Product.find({
        $or: [{ productInfo: search }, { name: search }],
        price: price,
        category: category,
      })
        .skip((page - 1) * 12)
        .limit(limit);
       //GET TOTAL LEGTH OF PRODUCT
        pages = await Product.find({
          $or: [{ productInfo: search }, { name: search }],
          price: price, category: category,
        }).count();
        pages = pages/12
    }
   
    result.pages = pages <1 ? 1 : pages;
    req.productList = result;
    req.pageUrl = `/search?q=${searchq}&min=${min}&max=${max}&limit=${limit}%category=${category}`
    next();
  } catch (error) {
    console.log(error.message);
    
    req.productList = [];
    next();
  }
};

module.exports = {
  searchProduct,
};
