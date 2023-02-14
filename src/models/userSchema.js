const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    hash_password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [
        "user",
        "admin",
        "branchManager",
        "salesManager",
        "purchaseManager",
        "supportTeam",
      ],
      default: "user",
    },branch: {
      type: String
    },
    address: {
      city: { type: String },
      place: { type: String },
      pincode: { type: String },
      district: { type: String },
    },
    phone: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    age: {
      type: Number,
    },
    salary: {
      type: Number,
    },
    active: {
      type: Boolean,
      default: false,
    },
    cartQuantity:{
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

userSchema.virtual("password").set(function (password) {
  this.hash_password = bcrypt.hash(password, 10);
});

userSchema.methods = {
  authenticate: async function(password) {
    return await bcrypt.compare(password, this.hash_password);
  },
}; 

module.exports = mongoose.model("user", userSchema);