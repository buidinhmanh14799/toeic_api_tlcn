const User = require('../models/userModel')
const bcrypt = require('bcrypt')


exports.register = function (req, res, next) {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (user == null) { //Kiểm tra xem email đã được sử dụng chưa
            User.findOne({ username: req.body.username }, (err2, user2) => {
                if (user2 == null) {
                    bcrypt.hash(req.body.password, 10, function (err, hash) { //Mã hóa mật khẩu trước khi lưu vào db
                        if (err) { return next(err); }
                        const user = new User(req.body)
                        user.role = 'admin' //sau khi register thì role auto là customer
                        user.password = hash;
                        user.save((err, result) => {
                            if (err) { return res.json({ err }) }
                            res.json({ user: result })
                        })
                    })
                }
                else {
                    res.json({ err: 'Tên đăng nhập đã tồn tại' })
                }
            })

        } else {
            res.json({ err: ' Email đã được đăng ký' })
        }
    })
}

// exports.create = (req, res) => {
//     const admin = new Admin({
//         name: req.body.name,
//         username: req.body.username,
//         password: req.body.password,
//         avatar: req.body.avatar,
//         email: req.body.email,
//         googleId: req.body.googleId,
//         facebookId: req.body.facebookId,
//         status: req.body.status
//     })
//     admin.save().then((data) => {
//         res.send(data)
//     }).catch((err) => {
//         res.status(500).send(err.message)
//     });
// }

exports.Update = (req, res) => {
    console.log("matkhaumoi:" + req.body.password)
    User.findByIdAndUpdate(req.params.id, { $set: req.body }).then(value => {
        if (req.body.password) {
            console.log(req.body.password);
            bcrypt.hash(req.body.password, 10).then(value => {
                console.log("băm ngoiai  " + value);
                User.findByIdAndUpdate(req.params.id, {$set: {password: value}}).then(value2=>{ 
                    console.log("băm trong hàm update  " + value);
                    console.log("oke")   
                    res.send(value2);
                }).catch(err=>{
                    console.log(err)
                })
            }).catch(err => {
                return null;
            })
        }else{
            res.send(value);
        }
        
    })
}
exports.Singin = (req, res) =>{
    User.findOne({_id: '5fb23ea658bd393618315756'}).then(value=>{
        bcrypt.compare('123', value.password).then(rs=>{
            res.send(rs);
        })
    })
    
}
exports.login = function(req, res){
    User.findOne({email: req.body.email}||{username: req.body.username}).exec(function(err, user){
        if(err) {
            return res.json({err})
        }else if (!user){
            return res.json({err: 'Username or Password are incorrect'})
        }
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if(result === true){
                req.session.user = user
                res.json({
                    user: user,
                    "login": "success"
                })
            }else{
                return res.json({err: 'Username or Password are incorrect'})
            }
        })
    })
}
exports.logout = function(req, res){
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if(err) {
                return res.json({err});
            } else {
                return res.json({'logout': "Success"});
            }
        });
    }
}