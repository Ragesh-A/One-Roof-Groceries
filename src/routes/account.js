const express = require("express");
const { requireSignin } = require("../commonMiddleware/index");
const {
   signup,
   signin,
   signout,
   changePassword,
   verifyPassword,
   createAccount,
} = require("../controller/auth");
const { uploadProfileImage } = require("../controller/imagehandler");
const { getUser, updateProfile } = require("../controller/user");
// const { otpVerification } = require('../controller/validators/otp')
const {
   validateSignupRequest,
   validateSigninRequest,
   isValidated,
} = require("../controller/validators/userAuth");
const { route } = require("./category");
const router = express.Router();

router.get("/", requireSignin, async (req, res) => {
   let user = await getUser(req);
   res.render("account", { user });
});

router
   .route("/edit")
   .get(requireSignin, async (req, res) => {
      let user = await getUser(req);
      res.render("account-edit", { user });
   })
   .post(
      requireSignin,
      uploadProfileImage.single("profilePicture"),
      updateProfile
   );

// router.get("/edit", requireSignin, async (req, res) => {
//    let user = await getUser(req);
//    res.render("account-edit", { user });
// });

// router.post(
//    "/edit",
//    requireSignin,
//    uploadProfileImage.single("profilePicture"),
//    updateProfile
// );

router.get("/signin", (req, res) => {
   if (req.cookies.Authorization) {
      res.redirect("/");
   } else {
      if (req.query.message) {
         console.log(req.query.message);
         req.query.message = false;
         res.render("signin", { message: "invalid email or password" });
      } else {
         res.render("signin", { message: false });
      }
   }
});

router.post("/signin", validateSigninRequest, isValidated, signin);

router.get("/signup", (req, res) => {
   if (req.cookies.Authorization) {
      res.redirect("/");
   } else {
      res.render("signup", { message: req.message || false });
      req.session.message = false;
   }
});

router.post("/signup", validateSignupRequest, isValidated, signup);
router.post("/verify", createAccount);

router.post("/verifyOtp", verifyPassword);
router.post("/password", changePassword);
// router.post('/signup', validateSignupRequest, isValidated, signup,/* otpVerification*/)
router.get("/signout", requireSignin, signout);
// router.post('/verify',otpConfig)
module.exports = router;
