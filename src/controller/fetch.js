const User = require('../models/userSchema');
const coupon = require('./coupon');

const dashboard = async (req, res) => {
  try {
    let sales = req.delivered.length;
    let user = req.userCount
    let admin  = req.adminCount
    res.status(200).json({ sales, user, admin});
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ err });
  }
};

const getaddress = async (req, res) => {
  try {
    let addressId = req.params.id;
    let user = await User.findOne({ _id: req.user._id });
    if (!user) return res.status(404).json({ err: 'address not found' });

    let address = user.address.find((address) => {
      return address._id.toString() === addressId;
    });
    res.status(200).json({ address });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

module.exports = {
  dashboard,
  getaddress,
};
