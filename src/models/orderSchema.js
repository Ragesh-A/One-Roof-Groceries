const mongoose = require('mongoose');

const orderschema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  billingAddress: {
    name: String,
    place: String,
    pincode: String,
    city: String,
    district: String,
    email: String,
    phone: String, 
  },
  products: {
    type: Array,
    required: true,
  },
  billAmount:{
    type: Number,
  },
  status: {
    type: String,
    required: true,
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  coupon:{
    type: String,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  deliveryDate: {
    type: Date,
  }

})


module.exports = mongoose.model('Order', orderschema);