const Order = require('../models/orderSchema');
const Cart = require('../models/cartSchema');

exports.createOrder = (req, res) => {
  let productArray = [];
  let totalPrice = 0;
  let totalDiscount = 0;

  Cart.findOne({ user: req.user._id })
    .populate('Items.product')
    .exec((err, cart) => {
      if (err) {
        console.log(err);
        res.redirect('/err');
      }
      if (cart) {
        
        cart.Items.forEach((item) => {
          let product = {
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            offer: item.product.name,
          };
          totalDiscount += item.product.offer;
          totalPrice += item.product.price * item.quantity;
          productArray.push(product);
        });


        try {
          const {name, address, phone, email, } = req.body;
      
          const newOrder = new Order({
            user: req.user._id,
            billingAddress: {
              name: req.body.name,
              place: req.body.place,
              pincode: req.body.pincode,
              city: req.body.city,
              district: req.body.district,
              email: req.body.email,
              phone: req.body.phone,
      
            },
            products: productArray,
            coupon: req.body.coupon,
            paymentMethod: req.body.paymentMethod,
          })
      
          newOrder.save((err, order) => {
            if (err) {
              console.log(err);
              res.redirect('/err');
            }
            if (order){
              console.log(order);
              res.render('common/thankyou',{ cartList: false , latestProducts: req.latestProducts , order })
              
            }
          })  
        } catch (error) {
          console.log(error);
        }
      }
    });
    
  
};
