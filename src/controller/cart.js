const { LEGAL_TLS_SOCKET_OPTIONS } = require('mongodb');
const Cart = require('../models/cartSchema');
const User = require('../models/userSchema');

exports.addToCart = async (req, res) => {
  Cart.findOne({ user: req.user._id }).exec((err, cart) => {
    if (err) return res.send(err);
    if (cart) {
      //if cart is already existing
      console.log('cart exist');
      const item = cart.Items.find((c) => c.product.equals(req.product._id));
      console.log(item);
      if (item) {
        Cart.findOneAndUpdate(
          { user: req.user._id, 'Items.product': req.product._id },
          { $inc: { 'Items.$.quantity': 1 } },
          { new: true }
        ).exec((err, pro) => {
          if (err) return res.send(err + 'dgh');
          if (pro) return res.redirect('/cart');
        });
      } else {
        //product is not existing

        Cart.findOneAndUpdate(
          { user: req.user._id },
          { $push: { Items: { product: req.product } } },
          { new: true }
        ).exec((err, result) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .send('An error occurred while updating the cart');
          }

          if (!result) {
            return res
              .status(404)
              .send('No cart was found for the specified user');
          }
          if (result) {
            User.findOneAndUpdate(
              { _id: req.user._id },
              { $inc: { cartQuantity: 1 } }
            );
            res.redirect('/cart');
          }
        });
      }
    } else {
      //if cart is not existing

      const newCart = new Cart({
        user: req.user._id,
        Items: { product: req.product._id },
      });

      newCart
        .save()
        .then((data) => {
          res.redirect('/cart');
        })
        .catch((err) => res.send(err));
    }
  });
};

// GET CART

exports.getCart = async (req, res, next) => {
  Cart.findOne({ user: req.user._id })
    .populate({
      path: 'Items.product',
      model: 'product',
      populate: {
        path: 'category',
        model: 'category',
      },
    })
    .exec((err, cart) => {
      if (err) console.log(err);
      if (cart) {
        req.cart = cart;
        // res.render('common/cart', { cartList: cart });
      } else {
        req.cart = false;
        // res.render('common/cart', { cartList: false });
      }
      next()
    });
};

//update the cart

exports.updateCart = async (req, res) => {
  if (req.body.action === 'inc') {
    req.body.action = 1;
  } else if (req.body.action === 'dec') {
    req.body.action = -1;
  } else {
    req.body.action = 0;
  }
  Cart.findOneAndUpdate(
    {
      user: req.user._id,
      'Items.product': req.product._id,
    },
    {
      $inc: { 'Items.$.quantity': req.body.action },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(err.code).json({ message: err.message });
    }
    if (result) {
      // IF CART IS QUANTITY IS EMPTY DELETE PRODUCT
      if (req.body.action === -1) {
        Cart.findOneAndUpdate(
          {
            user: req.user._id,
            'Items.product': req.product._id,
          },
          {
            $pull: { Items: { quantity: 0 } },
          }
        ).exec((err, result) => {
          if (err) {
            return console.log(err);
          }
        });

        //IF CART IS EMPTY DELETE CART

        Cart.findOneAndDelete({ user: req.user._id, Items: [] }).exec(
          (err, result) => {
            if (err) {
              return console.log(err);
            }
            if(result){
              console.log("deleted");
              res.status(200).json({message: "cart deleted successfully"})
            }
          }
        );
      }
    }
  });
};

//DELETE CART PRODUCT
async function deleteCartProduct() {
  // Cart.findOneAndDe
  Cart.findOneAndUpdate(
    { user: user, 'Items.product': productId },
    { $pull: { 'Items.$.product': productId } }
  ).exec((err, result) => {
    if (err) {
      return console.log(err);
    }
    if (result) {
      return console.log(result);
    }
  });
}


//place order 
exports.checkout = async (req, res) => {
  User.findOne({_id : req.user._id}).exec ((err, result) => {
    if (err) {
      console.log(err);
      res.redirect('/err')
    }

    if (result) {
      let user = {
        name : result.name,
        address: result.address,
        phone : result.phone,
        email : result.email,
      }
      console.log(user);
      console.log(req.cart);
      res.render('common/checkout',{user, cartList: req.cart.Items});
    }
  })
}