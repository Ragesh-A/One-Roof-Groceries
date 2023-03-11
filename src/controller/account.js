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
  renderAccount,
  renderEditAccount,
  renderWallet,
}