const User = require('../models/userModel')

exports.UserValidator = function(req, res, next){
    //name
    req.check('email', 'Invalid email.').isEmail();
    req.check('username', 'Username is required.').not().isEmpty();
    req.check('username', 'Username must be more than 2 characters').isLength({min:3});
    req.check('username', 'Username must be less than 100 characters').isLength({max:100});
    req.check('password', 'Password must be more than 6 characters').isLength({min:6});
    req.check('password', 'Username must be less than 100 characters').isLength({max:100});
    // req.check('password_confirm', 'Password confirm is required.').not().isEmpty();
    // req.check('password_confirm','Password mismatch').equals(req.body.password);

    //check for errors
    const errors = req.validationErrors();
    if(errors){
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({error: firstError});
    }
    next();
}