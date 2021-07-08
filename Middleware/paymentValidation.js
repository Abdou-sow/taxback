
const { body } = require('express-validator');

const paymentValidator =
    [
        body('amount').notEmpty().trim().escape().isFloat().isLength({ min: 1, max: 2 })
    ]

const activityPrixValidator =
    [
        body('prix').notEmpty().trim().escape().isLength({ min: 1, max: 2 })
    ]
module.exports = { paymentValidator, activityPrixValidator };