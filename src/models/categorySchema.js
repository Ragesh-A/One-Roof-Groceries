const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    slug: { 
        type: String,
        required: true,
        unique: true
    },
    parentId: {
        type: String
    },
    categoryImage: {
        type: String
    },
    description:{
        type: String
    }

},
{ timestamps: true });

module.exports = mongoose.model('category', categorySchema)

