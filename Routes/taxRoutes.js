const express = require('express')
const router = express.Router();

const  { debug } = require('../Middleware/debug')
const { signupUserValidator } = require('../Middleware/signupUserValidator')
const { loginUserValidator } = require('../Middleware/loginUserValidator')
const { paymentValidator } = require('../Middleware/paymentValidation');

const { getUserList, signupNewUser, login, payment, getActivityList } = require('../Controller/userController')

router.get("/users", debug, getUserList);

router.post("/signup", signupUserValidator, signupNewUser);

router.post("/activity", debug, getActivityList);

// todo : if need add list commune route router.post("/commune", addCommune);

router.post("/login", debug, loginUserValidator, login);

router.post("/payment", paymentValidator, payment);

router.all("*", (req, res) => {
    res.status(404).json({
        message: "Route pas trouver"
    })
})

module.exports = router;