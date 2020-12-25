const User = require('../models/userModel')
const bcrypt = require('bcrypt')

exports.getall = (req, res) => {
    User.find({ role: ['member', 'vipmember', 'promember'] }).then(data => {
        res.send(data)
    }).catch(err => res.status(500).send(err))
}
exports.delete = (req, res) => {
    User.findByIdAndUpdate(req.params.id, { $set: { status: false } }).then(() => {
        res.send('ok');
    }).catch(err => {
        res.status(500).send(err + '');
    })
}
exports.register = function (req, res) {
    try {
        let user = new User(req.body);
        user.role = 'member';
        user.status = true;
        bcrypt.hash(req.body.password, 10).then(value => {
            user.password = value;
        }).catch(err => {
            console.log(err)
        })
        user.save().then(value => {
            res.send(value);
        }).catch(err => {
            let object = err.errors;
            for (const key in object) {
                if (object.hasOwnProperty(key)) {
                    const element = object[key].message;
                    res.status(500).send(element)
                }
            }
            console.log(err)
        })

    } catch (error) {
        res.status(500).send(error);
    }

}

exports.update = (req, res) => {
    User.findByIdAndUpdate(req.params.id, { $set: res.body }).then(user => {
        res.send(user);
    }).catch(err => {
        res.status(500).send(err + '');
    })
}

exports.checkIDGoogle = (req, res) => {
    User.findOne({ googleId: req.params.id }).then((value) => {
        if (value) {
            console.log(value);
            res.send(true);
        } else {
            res.send(false);
        }
    }).catch((err) => {
        res.send(false);
    })
}
exports.checkIDFaceBook = (req, res) => {
    User.findOne({ facebookId: req.params.id }).then((value) => {
        if (value) {
            console.log(value);
            res.send(true);
        } else {
            res.send(false);
        }
    }).catch((err) => {
        res.send(false);
    })
}
exports.login = function (req, res) {
    User.findOne({ email: req.body.email } || { username: req.body.username }).exec(function (err, user) {
        if (err) {
            return res.status(500).send({ err })
        } else if (!user) {
            return res.status(500).send({ err: 'Username or Password are incorrect' })
        }
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (result === true) {
                req.session.user = user
                res.json({
                    user: req.session,
                    "login": "success"
                })
            } else {
                return res.json({ err: 'Username or Password are incorrect' })
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