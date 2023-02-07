const User = require('../models/userSchema');

exports.getemployees = (req, res, next) => {
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
      req.employees = employees;
    }
    next();
  });
};

exports.getOneUser = (req, res, next) => {
  User.findOne({
    _id: req.params._id,
  }).exec((err, user) => {
    if (err) {
      console.log(err);
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
