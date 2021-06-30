
const { body } = require('express-validator');

const signupUserValidator =
    [
        body('surname').notEmpty().trim().escape(),
        body('firstname').notEmpty().trim().escape(),
        body('dateofbirth').notEmpty(),
        body('address_personal').notEmpty().trim().escape().isLength({ min: 4, max: 50 }),
        body('personal_codepostal').notEmpty().trim().escape().isLength({ min: 5, max: 5 }),
        body('address_activity').notEmpty().trim().escape().isLength({ min: 4, max: 50 }),
        body('activity_codepostal').notEmpty().trim().escape().isLength({ min: 5, max: 5 }),
        body('activity').notEmpty().trim().escape(),
        body('commune').notEmpty().trim().escape().isLength({ min: 2, max: 25 }),
        body('telephone').notEmpty().trim().escape().isInt().isLength({ min: 9 }),
        body('password').notEmpty().trim().escape().isLength({ min: 6, max: 15 })
    ]

module.exports = { signupUserValidator };