const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const salt = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(myPlaintextPassword, salt);
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');

exports.getall = (req, res) => {
    User.find({ role: 'admin' }).then(data => {
        res.send(data)
    }).catch(err => res.status(500).send(err))
}
exports.getDetail = (req, res) => {
    User.findById(req.params.id).then(user => {
        if (user) {
            return res.status(200).json({
                success: true,
                message: user
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'user null'
            });
        }
    }).catch(err => {
        return res.status(500).json({
            success: false,
            message: err + ''
        });
    })
}
exports.register = async function (req, res) {
    console.log('???', req.body.password)
    try {
        let admin = new User(req.body);
        admin.role = 'admin';
        admin.status = true;
        admin.password = await bcrypt.hash(req.body.password, salt, null);
        admin.save().then(value => {
            return res.status(200).json({
                success: true,
                message: value
            });
        }).catch(err => {
            console.log(err)
            return res.status(500).json({
                success: false,
                message: err + ''
            });
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error + ''
        });
    }

}

exports.UpdatePassWord = (req, res) => {
    console.log("matkhaumoi:" + req.body.password)
    User.findByIdAndUpdate(req.params.id, { $set: req.body }).then(value => {
        if (req.body.password) {
            console.log(req.body.password);
            bcrypt.hash(req.body.password, 10).then(value => {
                console.log("băm ngoiai  " + value);
                User.findByIdAndUpdate(req.params.id, { $set: { password: value } }).then(value2 => {
                    console.log("băm trong hàm update  " + value);
                    console.log("oke")
                    return res.status(200).json({
                        success: true,
                        message: value2,
                    });
                }).catch(err => {
                    console.log(err)
                })
            }).catch(err => {
                return res.status(500).json({
                    success: false,
                    message: err + '',
                });
            })
        } else {
            res.send(value);
        }

    })
}
exports.updateInfo = (req, res) => {
    User.findByIdAndUpdate(req.params.id, { $set: req.body }).then(user => {
        return res.status(200).json({
            success: true,
            message: user,
        });
    }).catch(err => {
        return res.status(500).json({
            success: false,
            message: err + '',
        });
    })
}
exports.Singin = (req, res) => {
    User.findOne({ _id: '5fb23ea658bd393618315756' }).then(value => {
        bcrypt.compare('123', value.password).then(rs => {
            res.send(rs);
        })
    })

}
exports.login = async function (req, res) {
    const { email, password } = req.body;
    await User.findOne({ email: email }).exec(async function (err, user) {
        if (err) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            })
        } else if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Email is not registered',
            })
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (result === true) {
                const token = jwt.sign(
                    {
                        name: user.name,
                        email: user.email,
                    },
                    process.env.JWT_SECRET_KEY,
                    {
                        expiresIn: '24h',
                    },
                );
                const { _id, name, email, follower } = user;
                return res.status(200).json({
                    success: true,
                    message: 'Correct Details',
                    token: token,
                    user: {
                        _id,
                        name,
                        email,
                        follower,
                    },
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid Username or Password',
                });
            }
        })
    })
}
// exports.authentication = function (req, res) {
//     User.findOne({ email: req.body.email }).exec(function (err, user) {
//         if (err) {
//             return res.send({
//                 err: err + '',
//                 "login": "fail"
//             })
//         } else if (!user) {
//             return res.send({
//                 err: 'Email is not registered',
//                 "login": "fail"
//             })
//         }
//         bcrypt.compare(req.body.password, user.password, (err, result) => {
//             if (result === true) {
//                 var token = jwt.sign({
//                     name: user.name,
//                     username: user.username
//                 }, 'superSecret', {
//                     expiresIn: '24h'
//                 })
//                 res.json({
//                     success: true,
//                     token: token
//                 })
//             } else {
//                 return res.send({
//                     success: false,
//                     err: 'Username or Password are incorrect',
//                     "login": "fail"
//                 })
//             }
//         })
//     })
// }
exports.logout = function (req, res) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return res.json({ err });
            } else {
                return res.json({ 'logout': true });
            }
        });
    }
}
// Google Login
exports.google = async (req, res) => {
    const { idToken } = req.body;
    if (idToken) {
        const client = new OAuth2Client(process.env.GOOGLE_APP_ID);

        await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_APP_ID }).then(response => {
            const { email_verified, name, email, picture, sub } = response.payload;
            console.log('response.payload', response.payload)
            if (email_verified) {
                User.findOne({ email: email }).then(async user => {
                    if (user) {
                        const { _id, name, avatar, phonenumber, status } = user;
                        const token = jwt.sign(
                            {
                                name: name,
                                email: email,
                                avatar: avatar,
                                phonenumber: phonenumber,
                                status: status
                            },
                            process.env.JWT_SECRET_KEY,
                            {
                                expiresIn: '24h',
                            },
                        );
                        return res.status(200).json({
                            success: true,
                            message: 'Correct Details',
                            token: token,
                            user: {
                                _id,
                                name,
                                email,
                                avatar,
                                phonenumber,
                                status
                            },
                        });
                    } else {
                        const password = email + process.env.JWT_SECRET;
                        const user = new User({
                            name: name,
                            email: email,
                            password: await bcrypt.hash(password, salt, null),
                            avatar: picture,
                            googleId: sub,
                            phonenumber: '',
                            status: true
                        });
                        await user
                            .save()
                            .then(user => {
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                const { _id, name, email, avatar, phonenumber, status } = user;
                                const token = jwt.sign(
                                    {
                                        name: name,
                                        email: email,
                                        avatar: avatar,
                                        phonenumber: phonenumber,
                                        status: status
                                    },
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    process.env.JWT_SECRET_KEY,
                                    {
                                        expiresIn: '24h',
                                    },
                                );
                                res.status(200).json({
                                    success: true,
                                    message: 'Correct Details',
                                    token: token,
                                    user: {
                                        _id,
                                        name,
                                        email,
                                        avatar,
                                        phonenumber,
                                        status
                                    },
                                });
                            })
                            .catch(err => {
                                res.status(401).json({
                                    success: false,
                                    message: err + '',
                                });
                            });
                    }
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Google login failed. Try again',
                });
            }
        });
    } else {
        return res.status(401).json({
            success: false,
            message: 'no token provide',
        });
    }

};

exports.facebook = async (req, res) => {
    const { accessToken } = req.body;

    const { data } = await axios({
        url: 'https://graph.facebook.com/me',
        method: 'get',
        params: {
            fields: ['id', 'email', 'name'].join(','),
            access_token: accessToken,
        },
    });
    console.log(data);
    let { email } = data;
    const { id, name } = data; // { id, email, name }
    if (!email) {
        email = id + '@facebook.com';
    }

    User.findOne({ email }).then(async user => {
        if (user) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const { _id, name, avatar, phonenumber, status } = user;
            const token = jwt.sign(
                {
                    name: name,
                    email: email,
                    avatar: avatar,
                    phonenumber: phonenumber,
                    status: status
                },
                process.env.JWT_SECRET_KEY,
                {
                    expiresIn: '24h',
                },
            );
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore

            return res.json({
                token,
                user: {
                    _id,
                    name,
                    email,
                    avatar,
                    phonenumber,
                    status
                },
            });
        } else {
            const picture = 'https://www.flaticon.com/svg/static/icons/svg/236/236832.svg';
            const password = email + process.env.JWT_SECRET;
            user = new User({
                name: name,
                email: email,
                password: await bcrypt.hash(password, salt, null),
                avatar: picture,
                phonenumber: '',
                status: true,
                facebookId: id
            });

            user.save().then(data => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const { _id, name, follower } = data;
                return res.json({
                    token,
                    user: {
                        _id,
                        name,
                        email,
                        avatar,
                        phonenumber,
                        status
                    },
                });
            });
        }
    });
};
