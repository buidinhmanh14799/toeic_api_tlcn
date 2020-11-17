const User = require('../models/userModel')

exports.create = (req, res)=>{
    const user = new User({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        avatar: req.body.avatar, 
        email: req.body.email,
        googleId: req.body.googleId,
        facebookId: req.body.facebookId,
        status: req.body.status
    })
    user.save().then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.status(500).send(err.message)
    });
}
exports.register =(req, res)=>{
    User.findOne({email: req.body.email}, (err, user)=>{
        if(user==null){
            User.findOne({})
        }else{
            res.json({ err: 'Email đã được đăng ký' })
        }
    })
}

exports.checkIDGoogle = (req, res) => {
    admin.findOne({googleId: req.body.googleId}).then((value)=>{
        console.log(value);
        res.send(true);
    }).catch((err)=>{
        res.send(false);
    })
}
exports.checkIDFaceBook = (req, res) => {
    admin.findOne({facebookId: req.body.facebookId}).then((value)=>{
        console.log(value);
        res.send(true);
    }).catch((err)=>{
        res.send(false);
    })
}