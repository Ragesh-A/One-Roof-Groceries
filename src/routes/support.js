const express = require('express');
const admin = require('../controller/admin');
const userAuth = require('../commonMiddleware');
const user = require('../controller/user');
const router = express.Router();

router.get(
  '/',
  userAuth.requireSignin,
  userAuth.supportMiddleware,
  user.getAllUser,
  admin.renderSupportDashboard
);
router.get(
  '/users',
  userAuth.requireSignin,
  userAuth.supportMiddleware,
  user.getAllUser,
  admin.renderUsermanagement
);

module.exports = router;
