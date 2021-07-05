const express = require('express');
const router = express.Router();

const { validationResult } = require('express-validator');  // to process error results

const bcrypt = require('bcryptjs');     // to crypt sensible datas
const jwt = require('jsonwebtoken');    // to create jsonwebtoken

const userModel = require('../Model/userModel');
const activityModel = require('../Model/activityModel')
const communeModel = require('../Model/communeModel');
const paymentModel = require('../Model/paymentModel');

const signupNewUser = (async (req, res, next) => {

    const errorVal = validationResult(req);

    console.log("Im in user signup", req.body)

    const userSurname = req.body.surname
    const userFirstname = req.body.firstname
    const userDateofbirth = req.body.dateofbirth
    const userAddress_personal = req.body.address_personal
    const userAddress_Activity = req.body.address_activity
    const userActivityCommune = req.body.activity_commune
    const userActivity = req.body.activity
    const userTelephone = req.body.telephone
    const userPassword = req.body.password

    console.log(req.body)

    // const hasErrors = !errorVal.isEmpty();

    console.log("hasErrors:-", errorVal);

    try {

        const telephoneExist = await userModel.findOne({ telephone: req.body.telephone }).lean()    // check whether the user is already registered 
        // console.log("userfound", telephoneExist)

        if (telephoneExist) {

            res.json({
                message: `User already registered in ${userTelephone} telephone number`,
                telephoneExist
            })

        } else {

            const activityExist = await activityModel.findOne({ name: userActivity }).lean()   // check the user entered new activity

            if (!activityExist) {

                const addActivity = await activityModel.create({ name: userActivity })  // if user enters new activity save it in activity collection

                console.log(`New activity "${userActivity}" is added to database`)

                // res.json({
                //     message: `New activity "${userActivity}" is added to database`,
                //     addActivity
                // })
            }

            const communeExist = await communeModel.findOne({ name: userActivityCommune }).lean()   // check the user entered new commune

            if (!communeExist) {

                const addCommune = await communeModel.create({ name: userActivityCommune, information: userActivityCommune })  // if user enters new commune save it in commune collection

                console.log(`New Commune "${addCommune}" is added to database`)

                // res.json({
                //     message: `New Commune "${addCommune}" is added to database`,
                //     addCommune
                // })
            }

            if (errorVal.isEmpty()) {

                const activityID = await activityModel.findOne({ name: userActivity }).lean()  // take activity id to save with user collection

                const communeID = await communeModel.findOne({ name: userActivityCommune }).lean()     // take commune id to save with user collection

                console.log("activityID", activityID)
                console.log("communeID", communeID)

                const password = bcrypt.hashSync(userPassword)       // crypts the given password in to Bearer Token

                const userAdded = await userModel.create(
                    {
                        surname: userSurname,
                        firstname: userFirstname,
                        dateofbirth: userDateofbirth,
                        address_personal: userAddress_personal,
                        address_activity: userAddress_Activity,
                        activityID: activityID._id,
                        activity_communeID: communeID._id,
                        telephone: userTelephone,
                        password: password
                    })

                    const userAccountAdded = await paymentModel.insertMany([
                        {
                            userId: userAdded._id,
                            // amount: "0",
                            // datepaid: new Date()
                            payment: { amount: "10", paidon: new Date() }
                        }
                    ])
                    
                    res.json({
                        message: "User successfully added",
                        userAdded,
                        userAccountAdded
                    })

            } else {

                console.log("Please verify your details matches the regulation");

                res.status(400).json({
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
})

const login = (async (req, res) => {

    console.log("Im in login route")

    const tokenExpire = "900s"      // setting for token expires in 300s(15 minutes)

    // console.log("req.body", req.body)

    const userTelephone = req.body.telephone
    const userPassword = req.body.password

    try {

        console.log("req.body", req.body)

        // const passwordHash = bcrypt.hashSync(userPassword);

        // console.log("passwordHash", passwordHash)

        const telephoneExist = await userModel.findOne({ telephone: userTelephone })    // check is the user registered in collection

        const validPassword = bcrypt.compareSync(userPassword, telephoneExist.password)     // if yes, compare the user password  with saved password 

        // console.log("telephoneExist.password", telephoneExist.password)

        console.log("validPassword", validPassword)

        if (validPassword) {

            const validToken = await jwt.sign({     // creates token using jwt with "secret" code and time to expires the token
                id: telephoneExist._id
            }, "secret", {      // config.secret,   // when you connect with congig.js file use this
                expiresIn: tokenExpire       // token expiry time mentioned in const above
            })

            res.json({                                                                  // pass on login details to frontend for further process
                message: `${telephoneExist.surname}, ${userTelephone} is logged in`,
                telephoneExist,
                validToken,
                tokenExpire
            })

        } else {

            res.status(400).json({
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
    signupNewUser,
    login
}