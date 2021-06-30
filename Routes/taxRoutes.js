const express = require('express')
const router = express.Router();
const { signupUserValidator } = require('../Middleware/signupUserValidator')
const { loginUserValidator } = require('../Middleware/loginUserValidator')

const { getUserList, signupNewUser, login, payment } = require('../Controller/userController')

router.get("/users", getUserList);

router.post("/signup", signupUserValidator, signupNewUser);

// todo : if need add list activity route router.post("/activity", addActivity);

// todo : if need add list commune route router.post("/commune", addCommune);

router.post("/login", loginUserValidator, login);

router.post("/payment", payment);

router.all("*", (req, res) => {
    res.status(404).json({
        message: "Route pas trouver"
    })
})

module.exports = router;