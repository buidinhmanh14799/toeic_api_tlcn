const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');


let User = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minlength: [3, 'Phải ít nhất 3 ký tự'],
        maxlength: [100, 'Tên không thể quá 100 ký tự']
    },
    username:
    {
        type: String,
        trim: true
    },
    password:
    {
        type: String,
        trim: true
    },
    avatar: String,
    email: {
        type: String,
        unique: [true, "Email đã tồn tại!"],
        trim: true
    },
    role: {
        type: String,
        enum: ['admin', 'member', 'vipmember','promember']
    },
    googleId: String,
    facebookId: String,
    status: Boolean,
    phonenumber: String
})
User.plugin(uniqueValidator);
const UseraModel = mongoose.model('userAccount', User);



module.exports = UseraModel;