const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const { create } = require('../models/userSchema');
const { generateOtp } = require('./validators/otp');
const bcrypt = require('bcrypt');


exports.signup = async (req, res) => {
  try {

    if (req.message){
      console.log(req.message);
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

exports.createAccount = async(req, res) => {
  try {
    if (req.session.user.otp == req.body.otp) {

      let password = await bcrypt.hash(req.session.user.password, 10);

      const _user = new User({
        name: req.session.user.name,
        phone: req.session.user.phone,
        email: req.session.user.email,
        hash_password: password,
        role: 'user',
        active: true,
        address:{
          name: req.session.user.name,
          phone: req.session.user.phone,
          email: req.session.user.email
        }
      });
      _user.save();
      const token = createToken(_user);
      res.cookie('Authorization', `Bearer ${token}`).status(200).redirect('/');
    }
  } catch (error) {
    console.log(error);
    res.redirect('/err');
  }
};

//signin validation
exports.signin = async (req, res) => {
  if (req.message) {
    res.render('signin', { message: req.message.err });
  } else {
    User.findOne({ email: req.body.email }).exec( async (err, user) => {
      if (err) res.status(400).json({ err });
      if (user) {
        let t = await user.authenticate(req.body.password);
        
        if (t) {
          if (user.active) {
            const token = createToken(user);
            res
              .cookie('Authorization', `Bearer ${token}`)
              .status(200)
              .redirect('/');
          } else {
            res
              .status(403)
              .render('signin', { message: 'Your account has been BANNED!' });
          }
        } else {
          res
            .status(400)
            .render('signin', { message: 'wrong email or password' });
        }
      } else {
        res
          .status(400)
          .render('signin', { message: 'wrong email or password' });
      }
    });
  }
};

// signout
exports.signout = (req, res) => {
  res.clearCookie('Authorization').status(200).redirect('/');
};

//change otp in database
exports.updateOtp = async (req, res) => {
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

exports.verifyPassword = async (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {
      if (req.session.otp == req.body.otp) {
        req.session.email = req.body.email;
        res.render('changepassword');
      } else {
        req.query.message = 'invalid otp';
        res.render('signin', { message: 'invalid Otp' });
      }
    }
    if (err) {
      res.redirect('/err');
      console.log(err);
    }
  });
};

exports.changePassword = async (req, res) => {
  try {
    if (req.body.password.length > 7) {
      let password = bcrypt.hashSync(req.body.password, 10);
      User.updateOne(
        { email: req.session.email },
        { hash_password: password }
      ).exec((err, data) => {
        if (err) {
          res.status(400).redirect('/err');
        }
        if (data) {
          res.status(201).redirect('/account/signin');
        }
      });
    } else {
      console.log('false');
      res.redirect('/err');
    }
  } catch (error) {
    console.log('false');
    res.redirect('/err');
  }
};
/*---------------- CREATON OF TOKEN ------------------------*/
let createToken = (user) => {
  const token = jwt.sign(
    {
      _id: user._id,
      role: user.role,
      active: user.active,
    },
    process.env.JWT_KEY,
    {
      expiresIn: '1d',
    }
  );
  return token;
};
