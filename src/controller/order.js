const Order = require('../models/orderSchema');
const Cart = require('../models/cartSchema');
const { reduceWallet } = require('./user');


exports.createOrder = async (req, res, next) => {
  const orderDetails = req.session.userOrder;
  
  const coupon =
    req.session.coupon == undefined
      ? 'no coupon applied'
      : req.session.coupon.code;
  //GETTING THE CART
  try {
    //DECREASE WALLET
    const z = await reduceWallet(req.user._id, orderDetails.wallet);

    if (!z) {
      req.flash('err', 'wallect issue');
      return res.redirect('/err');
    }

    //CREATING ORDER
    const newOrder = new Order({
      user: req.user._id,
      billingAddress: orderDetails.billingAddress,
      products: orderDetails.products,
      actuallAmount: orderDetails.actuallAmount,
      billAmount: orderDetails.totalPrice,
      paymentMethod: orderDetails.paymentMethod,
      coupon: coupon,
      expectedDeliveryDate: orderDetails.expectedDeliveryDate,
      wallet: orderDetails.walletused,
      wallet_amount_used: orderDetails.wallet_amount_used,
    });

    newOrder.save((err, result) => {
      if (err) {
        return res.redirect('/cart/buy/address');
      }

      if (result) {
        req.session.coupon = undefined;
        res.redirect('/cart/buy/thankyou/');
        next();
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//LATEST ORDER

exports.getlatestOrder = async (req, res, next) => {
  try {
    const userOrder = await Order.findOne({ user: req.user._id }).sort({
      createdAt: -1,
    });
    if (!userOrder) {
      return res.redirect('/err');
    }
    req.latestOrder = userOrder;
    next();
  } catch (error) {
    console.log(error);
    res.redirect('/err');
  }
};

//TOTAL USER ORDERS

exports.getUserOrders = async (req, res, next) => {
  try {
    const userOrders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    if (!userOrders) {
      return res.redirect('/err');
    }

    req.userOrders = userOrders;
    next();
  } catch (error) {
    req.flash('err', error.message);
    res.redirect('/err');
  }
};

//TOTAL ORDERS
exports.getTotalOrders = async (req, res, next) => {
  try {
    const totalOrders = await Order.find({}).sort({
      updatedAt: 1,
    });
    if (!totalOrders) {
      return res.redirect('/err');
    }
    req.totalOrders = totalOrders;
    next();
  } catch (error) {
    req.flash('err', error.message);
    res.redirect('/err');
  }
};

//SINGLE ORDER
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id });
    if (!order) return res.redirect('bback');
    req.order = order;
    next();
  } catch (error) {
    req.flash('err', error.message);
    res.redirect('/err');
  }
};

//UPDATE ORDER
exports.updateOrder = async (req, res, next) => {
  let updateOrder = {
    status: req.body.status,
    expectedDeliveryDate: req.body.expectedDeliveryDate,
  };
  if (req.body.deliveryDate != '') {
    updateOrder.deliveryDate = req.body.deliveryDate;
  }

  try {
    const order = await Order.updateOne(
      { _id: req.params.id },
      { $set: updateOrder }
    );
    if (!order) {
      req.flash('err', 'order not updated');
      res.redirect(`/admin/edit-order/${req.params.id}`);
    }
    req.flash('success', 'order updated successfully');
    res.redirect(`/admin/orders`);
  } catch (error) {
    req.flash('err', error.message);
    res.redirect('/err');
  }
};

//CANCELL ORDER
exports.cancelOrder = async (req, res) => {
  try {
    Order.updateOne(
      { _id: req.params.id },
      { $set: { status: 'cancelled' } }
    ).exec((err, result) => {
      if (err) {
        req.flash('error', 'not cancelled');
        res.redirect('/account/my-orders');
      }
      if (result) {
        req.flash('success', 'order cancelled');
        res.redirect('/account/my-orders');
      }
    });
  } catch (error) {
    req.flash('err', error.message);
    res.redirect('/err');
  }
};

//CREATION OF ORDER SESSION

exports.createOrdersession = async (req, res, next) => {
  let productArray = [];
  let totalPrice = 0;
  let subtotal = 0;
  let coupon = 'no coupon applied';
  let walletAmt = req.wallet;
  let used = 'not used';
  let wallet_amount_used = 0;

  //EXPECTED DELIVERY DATE
  let date = new Date();
  let expedate = new Date(date.getTime());
  expedate.setDate(expedate.getDate() + 4);

  try {
    //GETTTING THE CART
    const userCart = await Cart.findOne({ user: req.user._id }).populate(
      'Items.product'
    );

    if (!userCart) {
      request.flash('error', 'failed to find you');
      return res.redirect('/cart/address');
    }

    //PRODUCTS
    userCart.Items.forEach((item) => {
      let product = {
        product_id: item.product._id,
        name: item.product.name,
        shortName: item.product.shortName,
        price: item.product.price,
        quantity: item.quantity,
        offer: item.product.offer,
      };
      subtotal += item.product.price * item.quantity;
      totalPrice +=
        item.product.price * item.quantity -
        (item.product.price * item.quantity * item.product.offer) / 100;
      productArray.push(product);
    });

    //BILL ADDRESS
    const billingAddress = {
      name: req.body.newname,
      place: req.body.newplace,
      pincode: req.body.newpincode,
      city: req.body.newcity,
      district: req.body.newdistrict,
      email: req.body.newemail,
      phone: req.body.newphone,
    };

    //PAYMENT METHOD
    const paymentMethod = req.body.paymentMethod;

    //IF COUPON APPLIED
    if (req.session.coupon) {
      let te = totalPrice * (req.session.coupon.discount / 100);
      if (te > req.session.coupon.maxdiscountedAmount) {
        te = req.session.coupon.maxdiscountedAmount;
      }
      totalPrice -= te;
    }
    let actuallAmount = totalPrice;

    //wallet usage
    if (req.body.wallet) {
      let balance = totalPrice - walletAmt;

      used = 'wallet used';

      if (balance >= 0) {
        wallet_amount_used = totalPrice - Math.abs(balance);

        totalPrice = balance;
        walletAmt = 0;
      }
      if (balance < 0) {
        wallet_amount_used = totalPrice;
        walletAmt = Math.abs(balance);
        totalPrice = 0;
      }
    }

    req.session.userOrder = {
      products: productArray,
      actuallAmount: actuallAmount,
      billingAddress: billingAddress,
      paymentMethod: paymentMethod,
      subtotal: subtotal,
      totalPrice: totalPrice,
      expectedDeliveryDate: expedate,
      wallet: walletAmt,
      walletused: used,
      wallet_amount_used: wallet_amount_used,
    };
    req.paymentAmount = actuallAmount;
    next();
  } catch (err) {
    console.log(err);
  }
};

//CHECK ORDER PAYMENT METHOD
exports.checkPaymentMethod = async (req, res, next) => {
  try {
    if (req.order.paymentMethod == 'cash-on-delivery') {
      
      req.order.actuallAmount = req.order.wallet_amount_used;
    }else{
      req.order.actuallAmount = req.order.billAmount
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

//RETURN ORDER
exports.returnOrder = async (req, res) => {
  try {
    Order.updateOne(
      { _id: req.params.id },
      { $set: { status: 'returned' } }
    ).exec((err, result) => {
      if (err) {
        req.flash('error', 'not returned');
        res.redirect('/account/my-orders');
      }
      if (result) {
        req.flash('success', 'order returned');
        res.redirect('/account/my-orders');
      }
    });
  } catch (error) {
    req.flash('err', error.message);
    res.redirect('/err');
  }
};

//GET ALL DELIVERED PRODUCT
exports.getAllDelivered = async (req, res, next) => {
  try {
    const delivered = await Order.find({
      $or: [{ status: 'delivered' }, { status: 'returned' }],
    });
    if (!delivered) {
      req.flash('err', "couldn't find delivery details");
      return res.redirect('/err');
    }

    req.delivered = delivered;
    next();
  } catch (error) {
    req.flash('err', "couldn't find delivery details");
    res.redirect('/err');
  }
};

//TOTAL SALES RETURNED
exports.totalSalesReturns = async (req, res, next) => {
  let returnAmt = 0;
  const totalSalesreturned = await Order.find({ status: 'returned' });
  if (!totalSalesreturned) return res.json({ returnAmt });

  totalSalesreturned.forEach((returns) => {
    returnAmt += returns.actuallAmount;
  });
  req.totalReturns = returnAmt;
  next();
};

//week wise report
exports.weeklySales = async function (req, res, next) {
  const currentDate = new Date();
  let sales = [];

  // Calculate the start and end of the current week
  const startOfWeek = new Date(currentDate);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  
  const endOfWeek = new Date(currentDate);
  endOfWeek.setHours(23, 59, 59, 999);
  endOfWeek.setDate(currentDate.getDate() + (6 - currentDate.getDay()));
  

  //GETTING THE DATA BASE ON THE WEEK
  try {
    const result = await Order.aggregate([
      { $match: { status: { $nin: ['cancelled', 'returned'] } } },
      { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          amount: { $sum: '$actuallAmount' },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 7 },
    ]);
    if (!result) return (result = null);
    
    req.weeklySales = result;
    next();
  } catch (error) {
    res.json({ error });
  }
};

//CATEGOETY WISE SALES
exports.returnsReports = async (req, res, next) => {
  try {
    const report = await Order.aggregate([
      { $match: { status: { $in: ['cancelled', 'returned'] } } },
      { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } },
          amount: { $sum: '$actuallAmount' },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 7 },
    ]);

    if (!report) return (req.report = null);
    req.returnsReports = report;
    next();
  } catch (error) {
    res.json({ error });
  }
};

exports.salesReport = async (req, res, next) => {
  try {
    const report = await Order.find({ status: 'delivered' }).sort({
      updatedAt: -1,
    });
    if (!report) {
      req.flash('err', 'failed to fetch sales report');
      return res.redirect('/err');
    }
    req.totalSales = report;
    next();
  } catch (error) {
    req.flash('err', error.message);
    res.redirect('/err');
  }
};

