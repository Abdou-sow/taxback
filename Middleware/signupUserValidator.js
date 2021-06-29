
const { body } = require('express-validator');

const signupUserValidator =
    [
        body('nom').notEmpty().trim().escape(),
        body('prenom').notEmpty().trim().escape(),
        body('naissance').notEmpty(),
        body('address_perso').notEmpty().trim().escape().isLength({ min: 4, max: 50 }),
        body('address_activite').notEmpty().trim().escape().isLength({ min: 4, max: 50 }),
        body('activite').notEmpty().trim().escape(),
        body('commune').notEmpty().trim().escape().isLength({ min: 2, max: 25 }),
        body('telephone').notEmpty().trim().escape().isInt().isLength({ min: 9 }),
        body('password').notEmpty().trim().escape().isLength({ min: 6, max: 15 })
    ]

module.exports = { signupUserValidator };