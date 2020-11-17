const mongoose = require('mongoose')
var validator = require('validator');


let User = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        // minlength: [3, 'Phải ít nhất 3 ký tự'],
        // maxlength: [100, 'Tên không thể quá 100 ký tự']
    },
    username:
    {
        type: String,
        trim: true,
    },
    password:
    {
        type: String,
        trim: true,
    },
    avatar: String,
    email: {
        type: String,
        unique: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'member']
    },
    googleId: String,
    facebookId: String,
    status: Boolean
})

const UseraModel = mongoose.model('userAccount', User);



module.exports = UseraModel;