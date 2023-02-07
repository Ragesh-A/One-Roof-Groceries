const eoverify = require('eoverify');
exports.generateOtp = (email) => {
  return new Promise((resolve, reject) => {
    eoverify
      .sendOtp(email, process.env.APP_NAME)
      .then((otp) => {
        resolve(otp);
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
