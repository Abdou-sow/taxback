const { body } = require('express-validator');

const signupAdminValidator =
    [
        body('surname').notEmpty().trim().escape(),
        body('firstname').notEmpty().trim().escape(),
        body('role').notEmpty().trim().escape().isString().isLength({ min: 5 }),
        body('telephone').notEmpty().trim().escape().isInt().isLength({ min: 9 }),
        body('password').notEmpty().trim().escape().isLength({ min: 6, max: 15 })
    ]

module.exports = { signupAdminValidator };