const Coupon = require('../models/couponSchema');

exports.createCoupon = async (req, res) => {
  try {
    let code = req.body.code.toLowerCase();
    // let status;
    // if (req.body.expiry >= Date.now()) {
    //   console.log('listed');
    //   status = 'listed';
    // } else {
    //   console.log('expired');
    //   status = 'expired';
    // }
    const _coupon = new Coupon({
      code: code,
      user_allowed: req.body.user_allowed,
      minimum_purchase: req.body.minimum_purchase,
      expiry: req.body.expiry,
      discount: req.body.discount,
      maxdiscountedAmount: req.body.maxdiscountedAmount,
    });

    _coupon.save((err, coupon) => {
      if (err) {
        console.log(err);
        // req.flash('error', err);
        console.log(err.message);
        req.flash('err', 'duplication of coupon dedected');
        res.status(400).redirect('/admin/coupon');
      }

      if (coupon) {
        req.flash('success', 'copon created successfully');
        res.redirect('/admin/coupon');
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getAllCoupons = async (req, res) => {
  Coupon.find({}).exec((err, coupons) => {
    if (err) {
      console.log(err);
      res.redirect('/*');
    }
    if (coupons) {
      res.render('admins/coupon', {
        user: req.user,
        page: 'coupons',
        couponsList: coupons,
        err: req.flash('err'),
        success: req.flash('success'),
      });
    }
  });
};

exports.getCoupon = async (req, res) => {
  try {
    Coupon.findOne({ _id: req.params.id }).exec((err, coupon) => {
      if (err) {
        console.log(err);
      }
      if (coupon) {
        res.json({ coupon });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCoupon = async (req, res) => {
  Coupon.deleteOne({ _id: req.params.id }).exec((err, data) => {
    if (err) {
      console.log(err);
      res.json(err);
    }
    if (data) {
      res.json({ data });
    }
  });
};

exports.updateCoupon = async (req, res) => {
  try {
    let code = req.body.code.toLowerCase();
    let couponData = {
      code: code,
      status: req.body.status,
      discount: req.body.discount,
      user_allowed: req.body.user_allowed,
      minimum_purchase: req.body.minimum_purchase,
    };
    Coupon.updateOne({ _id: req.params.id }, couponData).exec((err, data) => {
      if (err) {
        console.log(err);
        req.flash('success', 'Error while updating coupon');
        res.redirect('/admin/coupon');
      } else {
        req.flash('success', 'coupon updated successfully');
        res.redirect('/admin/coupon');
      }
    });
  } catch (error) {
    res.status(400).json({ message: 'error while updating data' });
  }
};

//CHECK COUPON
exports.checkCoupon = async (req, res) => {

  let userCode = req.body.code;
  let amount = req.totalAmount;
  //check copon alreay applied
  if(req.session.coupon ==  undefined){
    try {
      const _coupon = await Coupon.findOne({ code: userCode });
    if (!_coupon) {
      return res.status(200).json({ message: 'no coupon found' });
    }
    const { status,minimum_purchase, user_allowed, expiry, discount } = _coupon;
    if (
      status == 'listed' &&
      user_allowed > 0 &&
      expiry >= Date.now()
    ) {
    
      if(minimum_purchase <= amount){
        req.session.coupon = _coupon;
      reduceCoupon(_coupon._id)
      return res
        .status(200)
        .json({ message: 'coupon applied', discount});
      }
      
      return res.json({ message: "minimum purchase amount not met"})

    }
    else{
      res.status(200).json({ message: 'coupon expired'});
    }
    } catch (error) {
      res.status(404).json({ error})
    }
  }
  else{
    res.status(404).json({ message: "coupon already applied"})
  }
};

//REDUCCE COUPON COUNT
async function reduceCoupon(id){
  Coupon.updateOne({_id: id},{$inc: {user_allowed: -1}}).exec((err, result) => {
    if (err) console.log(err);
  })
}

//coupon middleware in for discount

const getCouponDiscount = (req, res, next) => {
  let coupon = false;
  if (req.session.coupon) {
    coupon = req.session.coupon
    

  }

  next();
}