
const { body } = require('express-validator');

const loginUserValidator =

    [
        body("telephone").not().isEmpty().trim().escape().isInt().isLength({ min: 9, max: 9 }),
        body("password").not().isEmpty().trim().escape().isLength({ min: 6, max: 15 }),
    ]

const userModificationValidator =

    [
        body('surname').notEmpty().trim().escape(),
        body('firstname').notEmpty().trim().escape(),
        body('address_personal').notEmpty().trim().escape().isLength({ min: 4, max: 150 }),
        body("telephone").not().isEmpty().trim().escape().isInt().isLength({ min: 9, max: 9 }),
    ]

module.exports = { loginUserValidator, userModificationValidator };