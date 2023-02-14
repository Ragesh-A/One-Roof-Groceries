const mongoose = require('mongoose')

const productSchema = new  mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    shortName: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    singleQty: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    offer: { type: Number },
    productPictures: [{
        img: {type: String}
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    productInfo:{
        type: String,
        trim : true,
        required: true
    },
    productFact:{
        type: String,
        trim : true,
        required: true
    },
    theme:{
        type: [{
            type: String,
            trim: true
        }]
    },
    paymentMethod: [{
        type: String,
        trim: true,
        required: true
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},
{timestamps : true})

productSchema.index({
    name: 'text',
    shortName: 'text',
    price: 'text',
    productInfo : 'text',    
},{
    name: 'product-index'
})

module.exports = mongoose.model('product', productSchema)