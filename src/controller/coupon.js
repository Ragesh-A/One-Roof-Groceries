const Coupon = require('../models/couponSchema');

exports.createCoupon = async (req, res) => {

  const _coupon = new Coupon({
    code: req.body.code,
    user_allowed: req.body.user_allowed,
    minimum_purchase: req.body.minimum_purchase,
    expiry: req.body.expiry,
    discount: req.body.discount,
  });

  _coupon.save((err, coupon) => {
    if (err) {
      console.log(err);
      res.status(400).redirect('/error');
    }

    if (coupon) {
      res.redirect('/admin/coupon');
    }
  });
};

exports.getAllCoupons = async (req, res, next) => {
  Coupon.find({}).exec((err, coupons) => {
    if (err) {
      console.log(err);
      res.redirect('/*');
    }
    if (coupons) {
      
      req.coupons = coupons;
      next();
    }
  });
};

exports.getCoupon = async (req, res) => {
  Coupon.findOne({ _id: req.params.id }).exec((err, coupon) => {
    if (err) {
      console.log(err);
    }
    if (coupon) {
      res.json({ coupon });
    }
  });
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

exports.updateCoupon = async (req, res, next) => {
  try {
    let couponData = {
      code: req.body.code,
      status: req.body.status,
      discount: req.body.discount,
      user_allowed: req.body.user_allowed,
      minimum_purchase: req.body.minimum_purchase
    };
    Coupon.updateOne({ _id: req.params.id }, couponData).exec((err, data)=>{
      if(err){
        console.log(err)
      }else{
        console.log(data);
      }
    });
    next()
  } catch (error) {
    res.status(400).json({message: "error while updating data"})
  }
};
