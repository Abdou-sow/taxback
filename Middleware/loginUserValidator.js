
const { body } = require('express-validator');

const loginUserValidator =

[
    body("telephone").not().isEmpty().trim().escape().isInt().isLength({ min: 9, max: 9 }),
    body("password").not().isEmpty().trim().escape().isLength({ min: 6, max: 15 }),
]

module.exports = { loginUserValidator };