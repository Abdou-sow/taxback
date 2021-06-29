const express = require('express');
const router = express.Router();

const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');     // to crypt sensible datas
const jwt = require('jsonwebtoken');    // to create jsonwebtoken

const userModel = require('../Model/userModel');
const { debug } = require('../Middleware/debug')

const getUserList = (debug, async (req, res) => {

    console.log("En getUserList controller", req.body)

    try {

        const userlist = await userModel.find({})

        res.json(userlist)

    } catch (error) {

        console.log("Error en user list", error)

        res.json({
            message: "Error en user list",
            error
        })
    }
})

const signupNewUser = ( async (req, res, next) => {

        const errorVal = validationResult(req);

        console.log("Im in user signup", req.body)

        const userSurname = req.body.surname
        const userFirstname = req.body.firstname
        const userDateofbirth = req.body.dateofbirth
        const userAddress_personal = req.body.address_personal
        const userAddress_work = req.body.address_work
        const userActivity = req.body.activity
        const userCommune = req.body.commune
        const userTelephone = req.body.telephone
        const userPassword = req.body.password

        console.log(req.body)

        // const hasErrors = !errorVal.isEmpty();

        console.log("hasErrors:-", errorVal);

        try {

            const telephoneExist = await userModel.findOne({ telephone: req.body.telephone }).lean()
            // console.log("userfound", telephoneExist)

            if (telephoneExist) {

                res.json({
                    message: `User already registered in ${userTelephone} telephone number`,
                    telephoneExist
                })

            } else {

                if (errorVal.isEmpty()) {

                    const password = bcrypt.hashSync(userPassword)       // crypts the given password in to Bearer Token

                    const userAdded = await userModel.create(
                        {
                            surname: userSurname,
                            firstname: userFirstname,
                            dateofbirth: userDateofbirth,
                            address_personal: userAddress_personal,
                            address_work: userAddress_work,
                            activity: userActivity,
                            commune: userCommune,
                            telephone: userTelephone,
                            password: password
                        })

                    res.json({
                        message: "User successfully added",
                        userAdded
                    })

                } else {

                    console.log("Please verify your details matches the regulation");

                    res.json({
                        message: `Error while processing your ${userTelephone} as new user`,
                        userTelephone,
                        errorVal
                    })
                }
            }

        } catch (error) {
            console.error(`Error while processing your ${userTelephone} as new user`, error)

            res.json({
                message: `Error while processing your ${userTelephone} as new user`,
                userTelephone
            })
        }

        try {


        } catch (error) {

            console.log(`Error while adding new user :- ${userTelephone}`, error);

            res.json({
                message: `Error while processing your ${userTelephone} as new user`,
                error
            })
        }
    }
)

const login = (

    async (req, res) => {

        console.log("Im in login route")

        console.log("req.body", req.body)

        const userTelephone = req.body.telephone
        const userPassword = req.body.password

        try {

            console.log("req.body", req.body)
            
            // const passwordHash = bcrypt.hashSync(userPassword);
            
            // console.log("passwordHash", passwordHash)
            
            const telephoneExist = await userModel.findOne({ telephone: userTelephone })
            
            const validPassword = bcrypt.compareSync(userPassword, telephoneExist.password)
            
            console.log("telephoneExist.password", telephoneExist.password)
            
            console.log("validPassword", validPassword)
            
            if (validPassword) {

                res.json({
    
                    message: `User ${userTelephone} is logged in`
    
                })

            } else {
                res.json({
    
                    message: `User ${userTelephone} login problem`
    
                })
            }
        } catch (error) {
            console.error("Error in login", error)
            res.json({
                message: `Error while login with user ${userTelephone}`,
                error
            })
        }
    })

module.exports = {
    getUserList,
    signupNewUser,
    login
}