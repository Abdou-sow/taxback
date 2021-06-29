const express = require('express')
const router = express.Router();
const { signupUserValidator } = require('../Middleware/signupUserValidator')
const { loginUserValidator } = require('../Middleware/loginUserValidator')

const { getUserList, signupNewUser, login } = require('../Controller/userController')

router.get("/users", getUserList);

router.post("/signup", signupUserValidator, signupNewUser);

router.post("/login", loginUserValidator, login);

router.all("*", (req, res) => {
    res.status(404).json({
        message: "Route pas trouver"
    })
})

module.exports = router;