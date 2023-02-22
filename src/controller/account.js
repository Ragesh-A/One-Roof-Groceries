
/*
const updateOtp = async (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {
      generateOtp(req.body.email).then((otp) => {
        console.log(otp);
        req.session.otp = otp;

        res.status(201).json({ message: 'otp send' });
      });
    } else {
      res.status(400).json({ message: 'No user Found' });
    }
  });
};


const signup = async (req, res) => {
  try {

    if (req.message){
      return res.render('signup', { message: req.message.err });
    } 

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      req.session.message = 'user already registered';
      return res.redirect('/account/signup');
    }
    let otp = await generateOtp(req.body.email);
    req.body.otp = otp;
    console.log(otp);
    req.session.user = req.body;
    res.render('otp', { message: req.session.message });
  } catch (error) {
    res.redirect('/account/signup');
  }
};


*/






//============ RENDER PAGES ================ 

const renderSignup = (req, res)=>{
  if (req.cookies.Authorization) {
    res.redirect('/');
  } else {
    res.render('signup', { message: req.message || req.session.message || false });
    req.session.message = false;
  }
}

const renderLogin = (req, res)=>{
  if (req.cookies.Authorization) {
    res.redirect('/');
  } else {
    if (req.query.message) {
      req.query.message = false;
      res.render('signin', { message: 'invalid email or password' });
    } else {
      res.render('signin', { message: false });
    }
  }
}

const renderAccount = (req, res) => {
  res.render('account', { user : req.result });
}

const renderEditAccount = (req, res) => {
  res.render('account-edit', { user : req.result });
}

const renderMyOrder = (req, res) => {
  res.render('common/orders', { orders: req.userOrders ,  success: req.flash('success') ,  err: req.flash('err') });
};

const renderWallet = (req, res) => {
  res.render('common/wallet', {wallet : req.wallet});
};
module.exports = { 
  renderLogin,
  renderSignup,
  renderMyOrder,
  // updateOtp,
  renderAccount,
  renderEditAccount,
  renderWallet,
}