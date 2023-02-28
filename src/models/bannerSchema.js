const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  name : {
    type: String,
    trim : true,
    required: true
  },
  action: {
    type: String,
    trim: true,
    default: '#',
  },
  message: {
    type: String,
    trim: true,
  },
  imageName: {
    type: String,
    trim: true,
    required: true
  }
},{timestamps: true});

module.exports = mongoose.model('banner', bannerSchema)