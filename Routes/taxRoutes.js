const express = require('express')
const router = express.Router();

const { debug } = require('../Middleware/debug')

const { signupUserValidator } = require('../Middleware/signupUserValidator')

const
    {
        loginUserValidator,
        userModificationValidator
    } = require('../Middleware/loginUserValidator')

const { paymentValidator } = require('../Middleware/paymentValidation');

const verifyToken = require('../Middleware/verifyToken');

const
    {
        signupNewUser,
        login
    } = require('../Controller/authController');       // route auth

const
    {
        getCommuneAccueilInfo,
        getActivityList,
        getCommuneList
    } = require('../Controller/publicController')       // public route

const
    {
        getUserList,
        getTelephoneNum,
        modificationUserInfo,
        payment,
        getCommuneInfo,
        getPaymentByUser,
        getAllUsersPayment
    } = require('../Controller/privateController');     // private route

router.get("/users", debug, getUserList);                       // http://localhost:9001/users     --for all users in the database

router.get("/telephone/:telephone", debug, getTelephoneNum)     // http://localhost:9001/telephone/148381111    --search by given telephone number

router.get("/communeinfo/:name", debug, getCommuneInfo);        // http://localhost:9001/communeinfo/Test Commune --base on selected commune 

router.get("/payment/:telephone", debug, getPaymentByUser);     // http://localhost:9001/payment/148381111  -- give information based on selected user by login id

router.get("/activities", debug, getActivityList);              // http://localhost:9001/activities    --for all activities in the database

router.get("/communes", debug, getCommuneList);                 // http://localhost:9001/communes   --for all communes in the database

router.get("/homepageinfo/:name", debug, getCommuneAccueilInfo) // http://localhost:9001/homepageinfo/champs-elysées --base on selected commune 

router.get("/paymentlist", debug, getAllUsersPayment);         // http://localhost:9001/paymentlist --for payment list for all users

router.post("/signup", debug, signupUserValidator, signupNewUser);      // http://localhost:9001/signup     --to signup new user

router.post("/login", debug, loginUserValidator, login);        // http://localhost:9001/login   --to login for registered user

router.post("/payment", debug, paymentValidator, payment);      // http://localhost:9001/payment --for currently logged in user

router.put("/modif/:telephone", debug, userModificationValidator, modificationUserInfo)     // http://localhost:9001/modif/148381111  modify current user telephone

router.all("*", (req, res) => {
    res.status(404).json({
        message: "Request not found"
    })
})

module.exports = router;