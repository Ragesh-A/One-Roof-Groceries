const User = require('../models/userSchema');
const coupon = require('./coupon');
const { getTotalOrders } = require('./order');

const dashboard = async (req, res) => {
  try {
    let sales = req.delivered;
    let weeklySales = req.weeklySales;
    let totalIncome = 0;
    sales.forEach((sale) => {
      totalIncome += sale.actuallAmount;
    });
    let salesReturns = req.totalReturns;
  
    res.status(200).json({
      totalIncome,
      salesReturns,
      weeklySales,
      returnsReports: req.returnsReports,
    });
  } catch (err) {
    console.log(err.message);
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

 const deleteAdr = async (req, res)=>  {
  try {
    let _id =  req.params.id;
    
    const a = await User.findOneAndUpdate({ _id: req.user._id },{$pull: {address: {_id}}});
    if (!a) return res.status(404).json({ err: 'not deleted'});
     res.status(200).json({ message: 'address deleted'});
  } catch (error) {
    console.log(error);
    res.json({err: error.message});
  }
};

module.exports = {
  dashboard,
  getaddress,
  deleteAdr,
};
