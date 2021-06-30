const express = require('express')
const router = express.Router();

const { debug } = require('../Middleware/debug')
const { signupUserValidator } = require('../Middleware/signupUserValidator')
const { loginUserValidator } = require('../Middleware/loginUserValidator')
const { paymentValidator } = require('../Middleware/paymentValidation');

const {
    getUserList,
    signupNewUser,
    login,
    payment,
    getActivityList,
    getCommuneList } = require('../Controller/userController')

router.get("/users", debug, getUserList);

router.post("/signup", signupUserValidator, signupNewUser);

router.get("/activity", debug, getActivityList);

router.get("/commune", getCommuneList);

router.post("/login", debug, loginUserValidator, login);

router.post("/payment", paymentValidator, payment);

router.all("*", (req, res) => {
    res.status(404).json({
        message: "Route pas trouver"
    })
})

module.exports = router;