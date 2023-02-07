const User = require("../models/userSchema");

module.exports = {
  getUser: async (req) => {
    let user = await User.findOne({ _id: req.user._id });
    return user;
  },
};

module.exports.addUser = (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {
      return res.status(400).redirect("/add-employee");
    }
    try {
      const _employee = new User({
        name: req.body.name,
        profilePicture: req.file.filename,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age,
        salary: req.body.salary,
        role: req.body.role,
      });
      _employee.save((err, data) => {
        if (err) {
          req.flash("addmessage", "error while saving");
          res.redirect("admins/addEmployee");
        } else {
          req.flash("addmessage", "Saving sucessful");
          res.redirect("/admin/employees");
        }
      });
  
    } catch (error) {
      console.log(error);
      res.redirect('/err');
    }
    

  });

};

module.exports.updateProfile = async(req, res)=>{
  const data = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    address: {
      district: req.body.district,
      pincode: req.body.pincode,
      city: req.body.city,
      place: req.body.place
    }
  };
  
if(req.file){
  data.profilePicture = req.file.filename
}
  updateUser(req.user._id, data)
  .then(
    res.redirect('/account')
  )
  .catch(console.log)
}
 
module.exports.updateEmployee = async(req, res, next)=>{
  try {
    await updateUser(req.params._id, req.body)
    req.message = true
  } catch (error) {
    console.log(error)
    req.message = false
  }
  next()
}

async function updateUser(id, data){
  try {
    const update = await User.updateOne({_id: id}, data);
      return "sucess"
  } catch (error) {
    console.log(error)
    return "failed" 
  }
   
}


module.exports.deleteUser = async( req, res)=>{
try {
    await User.deleteOne({_id : req.params.id})
    res.redirect('/admin/employees')
} catch (error) {
  console.log(error);
}

}

module.exports.getAllUser = async (req, res, next)=>{
  User.find({role: 'user'}).exec((err, users)=>{
    if(err){
      console.log(err);
      res.redirect('/support')
    }
    if(users){
      req.usersList = users;
      next()
    }
  })
}