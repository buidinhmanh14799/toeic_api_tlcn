const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const salt = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(myPlaintextPassword, salt);
const OAuth2Client = require('google-auth-library');

exports.get = async (req, res) => {
    await Post.find()
        .then(posts => {
            if (posts.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'no post yet',
                });
            }
            posts = posts.sort(compare);
            const data = [];
            posts.forEach(async post => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const { _id, name, avatar } = await User.findById(post.userId);
                data.push({
                    userId: _id,
                    name: name,
                    avatar: avatar,
                    postId: post._id,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    content: post.content,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    image: post.image,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    likeBy: post.likeBy,
                });
                if (data.length === posts.length) {
                    return res.status(200).json({
                        success: true,
                        message: 'get list post',
                        data,
                    });
                }
            });
        })
        .catch(err =>
            res.status(500).json({
                success: false,
                message: 'cannot get posts',
                err,
            }),
        );
};
exports.getall = (req, res) => {
    User.find({ role: 'admin' }).then(data => {
        res.send(data)
    }).catch(err => res.status(500).send(err))
}
exports.register = async function (req, res) {
    console.log('???', req.body.password)
    try {
        let admin = new User(req.body);
        admin.role = 'admin';
        admin.status = true;
        admin.password = await bcrypt.hash(req.body.password, salt, null);
        admin.save().then(value => {
            res.json({
                success: true,
            });
        }).catch(err => {
            console.log(err)
            res.status(500).send(err);
        })

    } catch (error) {
        res.status(500).send(error);
    }

}

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
exports.authentication = function (req, res) {
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
                var token = jwt.sign({
                    name: user.name,
                    username: user.username
                }, 'superSecret', {
                    expiresIn: '24h'
                })
                res.json({
                    success: true,
                    token: token
                })
            } else {
                return res.send({
                    success: false,
                    err: 'Username or Password are incorrect',
                    "login": "fail"
                })
            }
        })
    })
}
exports.apiRouter = function (req, res) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, 'superSecret', function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authentication token.' });
            } else {
                req.decoded = decoded;
                res.send('oke')
                // next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided'
        })
    }
}
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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const { email_verified, name, email } = response.payload;
            if (email_verified) {
                User.findOne({ email }).then(async user => {
                    if (user) {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        const { name, email } = user;
                        const token = jwt.sign(
                            {
                                name: name,
                                email: email,
                            },
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            process.env.JWT_SECRET_KEY,
                            {
                                expiresIn: '24h',
                            },
                        );
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        const { _id, follower } = user;
                        res.status(200).json({
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
                        const password = email + process.env.JWT_SECRET;
                        const follower = [];
                        const user = new User({
                            name: name,
                            email: email,
                            password: await hash(password, generateSalt(11)),
                            follower: follower,
                        });
                        await user
                            .save()
                            .then(user => {
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                const { _id, name, email, follower } = user;
                                const token = jwt.sign(
                                    {
                                        name: name,
                                        email: email,
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
                                        follower,
                                    },
                                });
                            })
                            .catch(err => {
                                res.status(401).json({
                                    success: false,
                                    message: err,
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
    }
    return res.status(401).json({
        success: false,
        message: 'no token provide',
    });
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
    let { email } = data;
    const { id, name } = data; // { id, email, name }
    if (!email) {
        email = id + '@facebook.com';
    }

    User.findOne({ email }).then(async user => {
        if (user) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
                expiresIn: '7d',
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const { _id, name, follower } = user;
            return res.json({
                token,
                user: {
                    _id,
                    name,
                    email,
                    follower,
                },
            });
        } else {
            const password = email + process.env.JWT_SECRET;
            const follower = [];
            user = new User({
                name: name,
                email: email,
                password: await hash(password, generateSalt(11)),
                follower: follower,
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
                        follower,
                    },
                });
            });
        }
    });
};
