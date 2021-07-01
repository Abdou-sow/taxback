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
    getCommuneInfo
     } = require('../Controller/userController')

router.get("/users", debug, getUserList);       // http://localhost:9001/users     --for all users in the database

router.get("/telephone/:telephone", debug, getTelephoneNum)     // http://localhost:9001/telephone/148381111    --search by given telephone number

router.post("/signup", debug, signupUserValidator, signupNewUser);      // http://localhost:9001/signup     --to signup new user

router.get("/activities", debug, getActivityList);      // http://localhost:9001/activities    --for all activities in the database

router.get("/communes", debug, getCommuneList);     // http://localhost:9001/communes   --for all communes in the database

router.post("/login", debug, loginUserValidator, login);        // http://localhost:9001/login   --to login for registered user

router.post("/payment", debug, paymentValidator, payment);      // http://localhost:9001/payment --for currently logged in user

router.get("/communeinfo/:name", debug, getCommuneInfo)         // http://localhost:9001/communeinfo/Test Commune --base on selected commune 

// router.get("/homepageinfo/:name", debug, getCommuneAccueilInfo)         // http://localhost:9001/communeinfo/champs-elysées --base on selected commune 

router.all("*", (req, res) => {
    res.status(404).json({
        message: "Request not found"
    })
})

module.exports = router;