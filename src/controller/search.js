const Product = require("../models/productSchema");

const searchProduct = async(req, res, next) => {
  
  let search = req.query.search
  try {
    const result = await Product.find(
      { $or : [{productInfo: {$regex : search, $options: 'i'}},{name: {$regex : search, $options: 'i'}}]}
    )
    req.productList = result;
    next();
  
  
  } catch (error) {
    req.flash('err', error.message)
    res.redirect('/err')
  }










//   Product.find({name: {
//     $regex: req.body.search, $options: 'i'
//   }}).exec((err, productList) => {
//     if (err) {
//       return res.status(500).json({
//         error: err
//       })
//     }if (productList){
//       console.log(productList);
//       req.productList = productList;
//       next();
//     }
//     else{
//       res.send("no result")
//     }
//   })
}

module.exports = {
  searchProduct,
};