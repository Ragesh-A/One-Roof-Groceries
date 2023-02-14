const express = require("express");
const router = express.Router();
const { requireSignin, adminMiddleware } = require("../commonMiddleware/index");
const {
   createCoupon,
   getAllCoupons,
   deleteCoupon,
   updateCoupon,
} = require("../controller/coupon");
const { dashboard } = require("../controller/fetch");
const { uploadProfileImage } = require("../controller/imagehandler");
const { getemployees, getOneUser } = require("../controller/test");
const { addUser, deleteUser, updateEmployee } = require("../controller/user");

/*----------------- ROUTES ----------------*/
const categoryRouter = require("./category");

/*-----------------------------------------*/
router.get(
   "/dashboard",
   requireSignin,
   adminMiddleware,
   getemployees,
   dashboard
);
router.get("/", requireSignin, adminMiddleware, (req, res) => {
   if (!req.query.page) {
      req.query.page = "dashboard";
   }
   res.render("layout/adminLayout", { user: req.user, page: "dashboard" });
});
router.get("/sales", requireSignin, adminMiddleware, (req, res) => {
   res.render("admins/totalSales", { user: req.user, page: "sales" });
});
router.get("/expenses", requireSignin, adminMiddleware, (req, res) => {
   res.render("admins/totalExpenses", { user: req.user, page: "expenses" });
});

router.get(
   "/employees",
   requireSignin,
   adminMiddleware,
   getemployees,
   (req, res) => {
      res.render("admins/employees", {
         user: req.user,
         employees: req.employees,
         page: "employees",
      });
   }
);

router.get(
   "/edit-employees/:_id",
   requireSignin,
   adminMiddleware,
   getOneUser,
   (req, res) => {
      res.render("admins/profile", {
         user: req.user,
         page: "employees",
      });
   }
);

router.post(
   "/edit-employees/:_id",
   requireSignin,
   adminMiddleware,
   updateEmployee,
   (req, res) => {
      res.redirect("/admin/employees/");
   }
);

router.get("/add-employee", requireSignin, adminMiddleware, (req, res) => {
   res.render("admins/addEmployee", {
      user: req.user,
      message: req.flash("addmessage"),
      page: "employees",
   });
});

router.post(
   "/add-employee",
   requireSignin,
   adminMiddleware,
   uploadProfileImage.single("profilePicture"),
   addUser
);

router.get("/delete/:id", deleteUser);
router.use("/category", categoryRouter);
router.get("/message", requireSignin, adminMiddleware, (req, res) => {
   res.render("admins/message", {
      user: req.user,
      page: "message",
   });
});

router.get("/layouts", requireSignin, adminMiddleware, (req, res) => {
   res.render("admins/layout", { user: req.user, page: "layouts" });
});

router.get(
   "/coupon",
   requireSignin,
   adminMiddleware,
   getAllCoupons,
   (req, res) => {
      res.render("admins/coupon", {
         user: req.user,
         page: "coupons",
         couponsList: req.coupons,
      });
   }
);

router.post("/coupon", requireSignin, adminMiddleware, createCoupon);
router.post(
   "/coupon/update/:id",
   requireSignin,
   adminMiddleware,
   updateCoupon,
   (req, res) => {
      res.redirect("/admin/coupon");
   }
);

router.get(
   "/coupon/delete/:id",
   (req, res, next) => {
      console.log(req.params.id + "sdgsdgfsdjhbjsd");
      next();
   },
   requireSignin,
   adminMiddleware,
   deleteCoupon
);

module.exports = router;
