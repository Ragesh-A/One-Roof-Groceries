const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    code:{
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    status: {
        type: String,
        default: 'listed'
    },
    user_allowed: {
        type: Number,
        required: true
    },
    minimum_purchase: {
        type : Number,
        required: true
    },
    maxdiscountedAmount: {
        type: Number
    },
    expiry:{
        type: Date,
        require: true
    },
    discount:{
        type: Number,
        required: true
    },
    image: {
        type: String
    }
}) 

module.exports = mongoose.model('coupon', couponSchema)