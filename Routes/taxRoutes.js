const express = require('express')
const router = express.Router();

const { paymentValidator } = require('../Middleware/paymentValidation');

const {  signupUserValidator } = require('../Middleware/signupUserValidator');

const { signupAdminValidator } = require('../Middleware/signupAdminValidatore');


const
{
    loginUserValidator,
    userModificationValidator
} = require('../Middleware/userValidator')

const verifyToken = require('../Middleware/verifyToken');

const { getAdminList, deleteUser } = require('../Controller/adminController');

const
    {
        signupNewUser,
        login,
        signupNewAdmin,
        loginAdmin
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


router.get("/users", getUserList);                       // http://localhost:9001/users     --for all users in the database

router.get("/adminusers", getAdminList)                 // http://localhost:9001/adminusers  -- for all admin users from database

router.get("/telephone/:telephone", getTelephoneNum)     // http://localhost:9001/telephone/148381111    --search by given telephone number

router.get("/communeinfo/:name", getCommuneInfo);        // http://localhost:9001/communeinfo/Test Commune --base on selected commune 

router.get("/payment/:telephone", getPaymentByUser);     // http://localhost:9001/payment/148381111  -- give information based on selected user by login id

router.get("/activities", getActivityList);              // http://localhost:9001/activities    --for all activities in the database

router.get("/communes", getCommuneList);                 // http://localhost:9001/communes   --for all communes in the database

router.get("/homepageinfo/:name", getCommuneAccueilInfo) // http://localhost:9001/homepageinfo/champs-elysées --base on selected commune 

router.get("/paymentlist", getAllUsersPayment);         // http://localhost:9001/paymentlist --for payment list for all users

router.post("/signup", signupUserValidator, signupNewUser);      // http://localhost:9001/signup     --to signup new user

router.post("/login", loginUserValidator, login);        // http://localhost:9001/login   --to login for registered user

router.post("/payment", paymentValidator, payment);      // http://localhost:9001/payment --for currently logged in user

router.post("/adminsignup", signupAdminValidator, signupNewAdmin)   // http://localhost:9001/adminsignup

router.post("/adminlogin", loginUserValidator, loginAdmin); // http://localhost:9001/adminlogin

router.put("/modif/:telephone", userModificationValidator, modificationUserInfo)     // http://localhost:9001/modif/148381111  modify current user telephone

router.delete("/deleteuser/:id", deleteUser)        // http://localhost:9001/deleteuser/60e34a307e7f396786678127   delete user from user collection

router.all("*", (req, res) => {
    res.status(404).json({
        message: "Request not found"
    })
})

module.exports = router;