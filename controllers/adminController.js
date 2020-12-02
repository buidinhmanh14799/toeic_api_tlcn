const User = require('../models/userModel')
const bcrypt = require('bcrypt')


exports.register = function (req, res) {
    try {
        let admin = new User(req.body);
        admin.role = 'admin';
        bcrypt.hash(req.body.password, 10).then(value => {
            admin.password = value;
        }).catch(err => {
            console.log(err)
        })
        admin.save().then(value => {
            res.send(value);
        }).catch(err => {
            let object = err.errors;
            var arr = []
            for (const key in object) {
                if (object.hasOwnProperty(key)) {
                    const element = object[key];
                    arr.push({ name: key, message: element.message })

                }
            }
            res.status(500).send(arr)
            console.log(err)
        })

    } catch (error) {
        res.status(500).send(error);
    }

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
                User.findByIdAndUpdate(req.params.id, { $set: { password: value } }).then(value2 => {
                    console.log("băm trong hàm update  " + value);
                    console.log("oke")
                    res.send(value2);
                }).catch(err => {
                    console.log(err)
                })
            }).catch(err => {
                return null;
            })
        } else {
            res.send(value);
        }

    })
}
exports.Singin = (req, res) => {
    User.findOne({ _id: '5fb23ea658bd393618315756' }).then(value => {
        bcrypt.compare('123', value.password).then(rs => {
            res.send(rs);
        })
    })

}
exports.login = function (req, res) {
    User.findOne({ email: req.body.email }).exec(function (err, user) {
        if (err) {
            return res.send({
                err: err + '',
                "login": "fail"
            })
        } else if (!user) {
            return res.send({
                err: 'Email is not registered',
                "login": "fail"
            })
        }
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (result === true) {
                req.session.user = user
                res.json({
                    user: req.session,
                    "login": "success"
                })
            } else {
                return res.send({
                    err: 'Username or Password are incorrect',
                    "login": "fail"
                })
            }
        })
    })
}
exports.logout = function (req, res) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return res.json({ err });
            } else {
                return res.json({ 'logout': "Success" });
            }
        });
    }
}