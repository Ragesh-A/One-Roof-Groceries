const User = require('../models/userSchema');
const bcrypt = require('bcrypt');

const getUser = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.user._id });
    if (!user) return res.redirect('/err');
    (req.result = user), next();
  } catch (error) {
    req, flash('err', error.message);
    res.redirect('/err');
  }
};

const addUser = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (err, user) => {
    if (user) {
      return res.status(400).redirect('/add-employee');
    }
    let password = await bcrypt.hash(req.body.password, 10);
    try {
      const _employee = new User({
        name: req.body.name,
        profilePicture: req.file.filename,
        email: req.body.email,
        hash_password: password,
        age: req.body.age,
        salary: req.body.salary,
        role: req.body.role,
      });
      _employee.save((err, data) => {
        if (err) {
          req.flash('addmessage', 'error while saving');
          res.redirect('admins/addEmployee');
        } else {
          req.flash('addmessage', 'Saving sucessful');
          res.redirect('/admin/employees');
        }
      });
    } catch (error) {
      console.log(error);
      res.redirect('/err');
    }
  });
};

const updateProfile = async (req, res) => {
  const data = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    'address.0': [
      {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        district: req.body.district,
        pincode: req.body.pincode,
        city: req.body.city,
        place: req.body.place,
      },
    ],
  };

  if (req.file) {
    data.profilePicture = req.file.filename;
  }
  updateUser(req.user._id, data)
    .then(res.redirect('/account'))
    .catch(console.log);
};

const updateEmployee = async (req, res, next) => {
  try {
    await updateUser(req.params._id, req.body);
    (req, res) => {
      res.redirect('/admin/employees');
    };
    req.message = true;
  } catch (error) {
    console.log(error);
    req.message = false;
  }
  next();
};

async function updateUser(id, data) {
  try {
    const update = await User.updateOne({ _id: id }, data);
    return 'sucess';
  } catch (error) {
    console.log(error);
    return 'failed';
  }
}

const deleteUser = async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    res.redirect('/admin/employees');
  } catch (error) {
    console.log(error);
  }
};

const getAllUser = async (req, res, next) => {
  User.find({ role: 'user' }).exec((err, users) => {
    if (err) {
      console.log(err);
      res.redirect('/support');
    }
    if (users) {
      req.usersList = users;
      next();
    }
  });
};
//ADD NEW ADDRESS
const newAddress = async (req, res) => {
  try {
    let t = await User.findOne({ _id: req.user._id });

    let user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { address: req.body } }
    );
    if (!user) {
      req.flash('sucess', 'new address not added');
      return res.redirect('/cart/buy/address');
    }
    req.flash('success', 'new address add sucessfully');
    res.redirect('/cart/buy/address');
  } catch (error) {
    console.log(error);
  }
};

//GET WALLET
const getWallet = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.user._id });
    if (!user) {
      req.flash('err', 'wallect has issues');
      return res.redirect('/err');
    }
    req.wallet = user.wallet;
    next();
  } catch (error) {
    console.log(error);
  }
};
//UPDATE WALLECT
const updateWallet = async (req, res, next) => {
  try {
    console.log(req.order.actuallAmount);
    const money = req.order.actuallAmount;
    const updatedWallet = await User.updateOne(
      { _id: req.user._id },
      { $inc: { wallet: money } },
      { upsert: true }
    );
    if (!updatedWallet) {
      req.flash('err', 'wallect failed to update while cancel order');
      return res.redirect('/err');
    }
    next();
  } catch (error) {
    req.flash('err', error.message);
    res.redirect('/err');
  }
};
//reduce the wallect amount
const reduceWallet = async (id, money) => {

  const updated = await User.updateOne(
    { _id: id },
    { $set: { wallet: money } }
  );

  if (!updated) {
    return false;
  }
  return true;
};


//============== RENDER PAGES ==================
const renderWishlist = (req, res) => {
  res.render('common/wishlist', { items: req.wishlist });
};
const renderHome = async (req, res) => {
  res.render('index', {
    latestProducts: req.latestProducts,
    page: 'home',
    bannerList: req.bannerList,
  });
};
const renderErr = async (req, res) => {
  res.render('malfunction', { err: req.flash('err') });
};

module.exports = {
  renderHome,
  getUser,
  addUser,
  updateProfile,
  updateEmployee,
  deleteUser,
  getAllUser,
  newAddress,
  getWallet,
  reduceWallet,
  updateWallet,
  renderWishlist,
  renderErr,
};
