const { LEGAL_TLS_SOCKET_OPTIONS } = require('mongodb');
const Cart = require('../models/cartSchema');
const User = require('../models/userSchema');

const addToCart = async (req, res) => {
  Cart.findOne({ user: req.user._id }).exec((err, cart) => {
    if (err) return res.send(err);
    if (cart) {
      //if cart is already existing
      console.log('cart exist');
      const item = cart.Items.find((c) => c.product.equals(req.product._id));
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

const getCart = async (req, res, next) => {
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
      next();
    });
};

//UPDATE CART
const updateCart = async (req, res) => {
  try {
    let action = 0;
    req.body.action === 'inc'
      ? (action = 1)
      : req.body.action === 'dec'
      ? (action = -1)
      : (action = 0);

    let userCart = await Cart.findOneAndUpdate(
      { user: req.user._id, 'Items.product': req.product._id },
      { $inc: { 'Items.$.quantity': action } },
      { new: true }
    );
    if (!userCart) return res.status(403).json({ message: 'not found' });

    //IF QUALTITY IS ZERO DELETE PRODUCT
    if (action == -1) {
      userCart.Items.forEach(async (item) => {
        if (item.quantity == 0) {
          await Cart.findOneAndUpdate(
            { user: req.user._id },
            { $pull: { Items: { quantity: 0 } } },
            { new: true }
          ).then((result) => {
            if (result.Items.length == 0) {
              deleteCart(result.user);
            }
          });
        }
      });
    }
    res.json({ message: 'cart updated' });
  } catch (error) {
    res.json({ message: 'error' });
  }
};

//DELETE CART
async function deleteCart(user) {
  await Cart.findOneAndDelete({ user: user }).catch((err) => {
    console.log(err);
  });
}

//PLACE ORDERS
const checkout = async (req, res) => {
  try {
    const userCart = await Cart.findOne(
      { user: req.user._id },
      { hash_password: 0 }
    )
      .populate('user')
      .populate({
        model: 'product',
        path: 'Items.product',
      });
    if (!userCart) return res.redirect('/cart');

    //check availability of products

    res.render('common/checkout', {
      userCart,
      success: req.flash('success'),
      wallet: req.wallet,
    });
  } catch (error) {
    res.render('common/error', { err: error });
  }
};

//CANCEL ORDER
// const cancelOrder = async(req, res)=>{

// }

//  MIDDLEWARE FOR GETTING THE AMOUNT OF CART ITEMS
const getCartAmount = (req, res, next) => {
  try {
    const userCart = req.cart;
    let totalAmount = 0;

    // console.log(userCart);
    userCart.Items.forEach((item) => {
      totalAmount +=
        item.product.price * item.quantity -
        (item.product.price * item.quantity * item.product.offer) / 100;
    });
    req.totalAmount = totalAmount;
    next();
  } catch (error) {
    res.redirect('/*');
  }
};

//WISHLIST CREATION
const addToWishlist = async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.id;
  try {
    const user = await User.findOne({ _id: userId });
    const allreadyAdded = user.wishlist.find(
      (id) => id.toString() === productId
    );

    if (allreadyAdded) {
      let user = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { wishlist: productId } },
        { new: true }
      );

      res.json({user})
    }else{
      let user = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { wishlist: productId } },
        { new: true }
      );
      res.json({user})
    }
  } catch (error) {
    req.json({'err': error.message});
   
  }
};

//GET USER WISHLIST 
const getWishlist = async (req, res, next) => {
  const userId = req.user._id;

  try {
    
   const user = await User.findOne({_id: userId}).populate("wishlist");
   if(!user){
    req.flash('err','user not found')
    return res.redirect('/err-')
   }

   req.wishlist = user.wishlist
   next();

  } catch (error) {
    req.flash('err','user not found')
    return res.redirect('/err')
  }
}



/*============== RENDER PAGES ============*/
const renderCart = (req, res) => {
  res.render('common/cart', { cartList: req.cart, err: req.flash('err') });
};

const renderConfirmPurchase = (req, res) => {
  res.render('common/thankyou', {
    cartList: false,
    latestProducts: req.latestProducts,
    order: req.latestOrder,
  });
};
const renderOrderConfirm = async (req, res) => {
  res.render('common/order-confirm', { orderDetails: req.session.userOrder });
};
//============================================================================

module.exports = {
  renderCart,
  checkout,
  updateCart,
  updateCart,
  getCart,
  addToCart,
  renderCart,
  getCartAmount,
  renderOrderConfirm,
  renderConfirmPurchase,
  // cancelOrder
  getWishlist,
  addToWishlist
};
