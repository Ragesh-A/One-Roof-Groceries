const express = require('express');
const admin = require('../controller/admin');
const userAuth = require('../commonMiddleware');
const { getAllUser } = require('../controller/user');
const router = express.Router();

router.get(
  '/',
  userAuth.requireSignin,
  userAuth.supportMiddleware,
  admin.renderSupportDashboard
);
router.get(
  '/users',
  userAuth.requireSignin,
  userAuth.supportMiddleware,
  getAllUser,
  admin.renderUsermanagement
);

module.exports = router;
