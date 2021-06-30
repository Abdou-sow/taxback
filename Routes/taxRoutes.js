const express = require('express')
const router = express.Router();

const { debug } = require('../Middleware/debug')
const { signupUserValidator } = require('../Middleware/signupUserValidator')
const { loginUserValidator } = require('../Middleware/loginUserValidator')
const { paymentValidator } = require('../Middleware/paymentValidation');

const {
    getUserList,
    getTelephoneNum,
    signupNewUser,
    login,
    payment,
    getActivityList,
    getCommuneList,
    getCommuneInfo } = require('../Controller/userController')

router.get("/users", debug, getUserList);

router.get("/telephone/:id", getTelephoneNum)

router.post("/signup", signupUserValidator, signupNewUser);

router.get("/activities", debug, getActivityList);

router.get("/communes", getCommuneList);

router.post("/login", debug, loginUserValidator, login);

router.post("/payment", paymentValidator, payment);

router.get("/commune/:id", getCommuneInfo)  //****** */ NOT WORKING WORK ON IT 

router.all("*", (req, res) => {
    res.status(404).json({
        message: "Route pas trouver"
    })
})

module.exports = router;