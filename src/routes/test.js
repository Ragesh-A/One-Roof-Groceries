const express = require('express');
const router = express.Router();
const { generateOtp } = require('../controller/validators/otp');

router.get('/', (req, res) => {
  let email = 'ragesha2017@gmail.com';

  generateOtp(email).then((otp) => {
    console.log(otp);
  });
  res.send('otp');
});

router.post('/', (req, res) => {
  generateOtp(req.body.email).then((otp) => {});
});

module.exports = router;
