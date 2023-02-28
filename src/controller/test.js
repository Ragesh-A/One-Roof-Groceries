const User = require('../models/userSchema');

exports.getemployees = (req, res) => {
  User.find(
    {
      role: { $nin: ['user', 'admin'] },
    },
    {
      hash_password: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    }
  ).exec((err, employees) => {
    if (err) {
      req.employees = false;
    }
    if (employees) {
      res.render('admins/employees', {
        user: req.user,
        employees: employees,
        page: 'employees',
      });
    }
  });
};

exports.getOneUser = (req, res, next) => {
  User.findOne({
    _id: req.params._id,
  }).exec((err, user) => {
    if (err) {
      req.user = {name : "no user found"};
    }
    if (user) {
      req.user = user;
    }
    next();
  });
};

exports.changeAuthorization = async (req, res) => {
  User.findOne({ _id: req.params.id }).exec((err, user) => {
    if (err) res.status(400).json({ err });

    if (user) {
      if (user.active) {
        User.updateOne(
          { _id: req.params.id },
          { $set: { active: false } }
        ).exec((err, data) => {
          if (err) res.status(400).json({ err });
          if (data) res.status(201).json({ data });
        });
      } else {
        User.updateOne({ _id: req.params.id }, { $set: { active: true } }).exec(
          (err, data) => {
            if (err) res.status(400).json({ err });
            if (data) res.status(201).json({ data });
          }
        );
      }
    }
  });
};

exports.getUserCount = async function (req, res, next) {
  try {

   const userCount = await User.find({
      role: { $nin: ['admin', 'manager', 'supportTeam'] },
    }).count();
  
    if(!userCount) return res.status(400)

    req.userCount = userCount
    next()
  
  } catch (error) {
   res.status(500).json({ error})
  }

  
};

exports.getEmCount = async function (req, res, next) {
   try {
 
    const adminCount = await User.find({
      role: { $nin: ['admin', 'user'] },
       },
     ).count();
   
     if(!adminCount) return res.status(400)
 
     req.adminCount = adminCount
     next()
   } catch (error) {
    res.status(500).json({ error})
   }
 
   
 };