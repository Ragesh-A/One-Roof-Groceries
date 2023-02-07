const { check, validationResult } = require('express-validator')

exports.validateSignupRequest = [
    check('name', 'name must  at least five character').notEmpty().isLength({ min: 5 }),
    check('phone', 'Phone number Should be valid').notEmpty().isLength({ min: 10 }),
    check('email', 'email is required').notEmpty().isEmail(),
    check('password', 'password should be at least five character').notEmpty().isLength({ min: 2 }),
    check('confirmpassword', 'both password should be equal').notEmpty().isLength({ min: 2 })
];

exports.validateSigninRequest = [
    check('email', 'email is required').isEmail(),
    check('password', 'Password must be atleast 8 characters').isLength({ min: 8 }),
];

exports.isValidated = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
        req.message = { err: errors.array()[0].msg }
    }
    next()
}
