
const { body } = require('express-validator');

const paymentValidator =
    [
        body('telephone').notEmpty().trim().escape().isInt().isLength({ min: 9 }),
        body('amount').notEmpty().trim().escape().isFloat().isLength({ min: 1, max: 2 })
    ]

module.exports = { paymentValidator };