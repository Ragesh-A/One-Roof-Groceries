const nodemailer = require('nodemailer');
const fEmail = process.env.APP_EMAIL;
const appName = process.env.APP_NAME;
// const appUrl = process.env.APP_URL;
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  auth: {
    user: fEmail,
    pass: process.env.APP_PASS,
  },
});
const email = {
  sendOtp: (email) => {
    try {
      return new Promise( (resolve, reject)=>{
        const otp = Math.floor(Math.random() * 9000) + 1000;
        const mailOption = {
          from: `${appName} ${fEmail}`,
          to: email,
          subject: 'Otp verification',
          html: `<h1 style="color: #32cd32; text-align:center; font-weight: 800">${appName}</h1><br><h2 style="text-align:center">Your verification code is <br><b style="font-size: 24px"> ${otp}</b> </h2>`,
      };
        transporter.sendMail(mailOption, (err, info)=>{
          if (err) {
            reject(err);
          } else {
            resolve(otp);
          } 
        });
      });
    } catch (error) {
      console.log("message not sent", error);
    }
  },
  resendOtp: (email) => {
    return new Promise((resolve, reject)=>{
      const otp = Math.floor(Math.random() * 9000) + 1000;
      const mailOption = {
        from: `${appName} ${process.env.EMAIL}`,
        to: email,
        subject: 'Otp - Resend - verification',
        html: `<h1 style="color: #32cd32; text-align:center; font-weight: 800">${appName}</h1><br><h2 style="text-align:center">Your verification code is <br><b style="font-size: 24px"> ${otp}</b> </h2>`,
    };
    transporter.sendMail(mailOption, (err, info)=>{
      if(err) console.log(err)
    });
    return { success: true, message: `New otp sent to ${email}`, otp: otp };
  
    });
  },
};
module.exports = email;