const { log } = require('console');
const Razorpay = require('razorpay');

const IDS = {
  razorpay_payment_id: 'pay_29QQoUBi66xm2f',
  razorpay_order_id: 'order_9A33XWu170gUtm',
  razorpay_signature:
    '9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d',
};

var instance = new Razorpay({
  key_id: process.env.RAZOR_PAY_ID,
  key_secret: process.env.RAZOR_PAY_SCERET,
});

const createOnlineOrder = async (req, res, next) => {
  try {
    
    const method = req.body.paymentMethod;
    if (method === 'online-payment') {
      const amount = Math.round(req.paymentAmount)*10;
      console.log(amount);
      const receipt = (req.user._id.toString() + Date.now()).substring(10).toUpperCase();
      var options = {
        amount: amount,
        currency: 'INR',
        receipt,
      };
     const newOrder = await instance.orders.create(options);
     if(!newOrder){
      return res.redirect('/cart/buy/order')
     }
     req.session.userOrder.actuallAmount = amount;
     req.tOrder = newOrder;
    }
    next();
  } catch (error) {
    console.log(error);
  }

};

// const verifyOnlinePayment = (req, res) => {
//   let body =
//     req.body.response.razorpay_order_id +
//     '|' +
//     req.body.response.razorpay_payment_id;

//   var crypto = require('crypto');
//   var expectedSignature = crypto
//     .createHmac('sha256', '<YOUR_API_SECRET>')
//     .update(body.toString())
//     .digest('hex');
//   console.log('sig received ', req.body.response.razorpay_signature);
//   console.log('sig generated ', expectedSignature);
//   var response = { signatureIsValid: 'false' };
//   if (expectedSignature === req.body.response.razorpay_signature)
//     response = { signatureIsValid: 'true' };
//   res.send(response);
// };

const verifyOnlinePayment = async (req, res, next) => {
  if(req.session.userOrder.paymentMethod == 'cash-on-delivery'){
    return res.redirect('/cart/buy/address')
  }
  if(req.body.razorpay_payment_id != ''){
    console.log("reached");
    return next();
  }
  res.redirect('/cart/buy/address')
}
const verifyOfflinePayment = async (req, res, next) => {
  if(req.session.userOrder.paymentMethod != 'cash-on-delivery'){
    return res.redirect('/cart/buy/address')
  }
  next();
}
module.exports = {
  createOnlineOrder,
  verifyOnlinePayment,
  verifyOfflinePayment
};
