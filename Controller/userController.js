const express = require('express');
const router = express.Router();

const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');     // to crypt sensible datas
const jwt = require('jsonwebtoken');    // to create jsonwebtoken

const userModel = require('../Model/userModel');
const activityModel = require('../Model/activityModel')
const communeModel = require('../Model/communeModel');
const communeInfoModel = require('../Model/communeInfoModel');
const paymentModel = require('../Model/paymentModel');

const getUserList = (async (req, res) => {

    console.log("En getUserList controller", req.body)

    try {

        const userlist = await userModel.find({})

        res.json({
            message: "List of users currently available in database",
            userlist
        })

    } catch (error) {

        console.log("Error en user list", error)

        res.json({
            message: "Error en user list",
            error
        })
    }
})

const getTelephoneNum = (async (req, res) => {

    console.log("Im in getTelephoneNum", req.params.id)

    try {

        const telephoneExist = await userModel.findOne({ telephone: req.params.id }).lean()
        console.log("userfound", telephoneExist)

        if(telephoneExist) {

            res.json({
                message: "User Found",
                telephoneExist
            })
        } else {

            res.json({
                message: "User not found",
                telephoneExist

            })
        }
        
    } catch (error) {
        console.log("Error while verifing the user telephone number")

        res.json({
            message: "Error while verifing the user telephone number",
            error
        })
    }
})

const getActivityList = (async (req, res) => {

    console.log("Im in getActivityList", req.body)

    try {
        const activityList = await activityModel.find({})

        res.json({
            message: "List of activity currently available in database",
            list

        })

    } catch (error) {
        console.log("Error while getting data for activity")

        res.json({
            message: "Error while getting data for activity",
            error
        })
    }
})

const getCommuneList = (async (req, res) => {

    console.log("Im in getCommuneList", req.body)

    try {
        const communeList = await communeModel.find({})

        res.json({
            message: "List of Commune currently available in database",
            list

        })

    } catch (error) {
        console.log("Error while getting data for Commune")

        res.json({
            message: "Error while getting data for Commune",
            error
        })
    }
})

const signupNewUser = (async (req, res, next) => {

    const errorVal = validationResult(req);

    console.log("Im in user signup", req.body)

    const userSurname = req.body.surname
    const userFirstname = req.body.firstname
    const userDateofbirth = req.body.dateofbirth
    const userAddress_personal = req.body.address_personal
    const userPersonalcodepostal = req.body.personal_codepostal
    const userAddress_Activity = req.body.address_activity
    const userActivitycodepostal = req.body.activity_codepostal
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

            const activityExist = await activityModel.findOne({ activity: req.body.activity }).lean()

            if (!activityExist) {

                const addActivity = await activityModel.create({ name: userActivity })

                console.log(`New activity "${userActivity}" is added to database`)

                // res.json({
                //     message: `New activity "${userActivity}" is added to database`,
                //     addActivity
                // })
            }

            const communeExist = await communeModel.findOne({ commune: req.body.commune }).lean()

            if (!communeExist) {

                const addCommune = await communeModel.create({ name: userCommune, codepostal: userActivitycodepostal })

                console.log(`New Commune "${addCommune}" is added to database`)

                // res.json({
                //     message: `New Commune "${addCommune}" is added to database`,
                //     addCommune
                // })
            }

            if (errorVal.isEmpty()) {

                const activityID = await activityModel.findOne({ name: req.body.activity }).lean()

                const communeID = await communeModel.findOne({ name: req.body.commune }).lean()

                console.log("activityID", activityID)
                console.log("communeID", communeID)

                const password = bcrypt.hashSync(userPassword)       // crypts the given password in to Bearer Token

                const userAdded = await userModel.create(
                    {
                        surname: userSurname,
                        firstname: userFirstname,
                        dateofbirth: userDateofbirth,
                        address_personal: userAddress_personal,
                        personal_codepostal: userPersonalcodepostal,
                        address_activity: userAddress_Activity,
                        activity_codepostal: userActivitycodepostal,
                        activity: userActivity,
                        activityID: activityID._id,
                        commune: userCommune,
                        communeID: communeID._id,
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
})

const login = (async (req, res) => {

    console.log("Im in login route")

    const tokenExpire = "300s"      // token expires in 300s(5 minutes)

    // console.log("req.body", req.body)

    const userTelephone = req.body.telephone
    const userPassword = req.body.password

    try {

        console.log("req.body", req.body)

        // const passwordHash = bcrypt.hashSync(userPassword);

        // console.log("passwordHash", passwordHash)

        const telephoneExist = await userModel.findOne({ telephone: userTelephone })

        const validPassword = bcrypt.compareSync(userPassword, telephoneExist.password)

        // console.log("telephoneExist.password", telephoneExist.password)

        console.log("validPassword", validPassword)

        if (validPassword) {

            const validToken = await jwt.sign({     // creates token using jwt with "secret" code and time to expires the token
                id: telephoneExist.id
            }, "secret", {
                expiresIn: tokenExpire       // token expiry time mentioned in const above
            })

            res.json({
                message: `${telephoneExist.surname}, ${userTelephone} is logged in`,
                telephoneExist,
                validToken,
                tokenExpire
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

const payment = (async (req, res) => {

    console.log("Im in payment route")
    // const userPaymentDetail = req.body;

    const userTelephone = req.body.telephone;
    const userAmount = req.body.amount;

    try {

        const userInfo = await userModel.findOne({ telephone: userTelephone })

        // pick user information from collection
        if (userInfo) {

            console.log("User, Commune and Activity Commune", userInfo.telephone, userInfo.communeID, userInfo.activityID);

            // add new payment 
            const addPayment = await paymentModel.create(
                {
                    telephone: userTelephone,
                    communeID: userInfo.communeID,
                    activityID: userInfo.activityID,
                    amount: userAmount
                })

            res.json({
                message: "Payment added successfully",
                addPayment,
                userInfo
            })

        } else {

            res.json({
                message: "User is not registered or user information not available, payment cancelled",
                userInfo
            })
        }

    } catch (error) {
        console.log("Error while making payment", error)
    }
})

// NOT WORKING COMPLETE THE CODE
const getCommuneInfo = (async (req, res) => {

    console.log("Im in getCommuneInfo", req.query.params)
    const userCommune = req.body;

    try {

        const communeInfo = await communeModel.findOne({ name: userCommune })

        console.log("communeInfo", communeInfo)
        console.log("communeInfo", communeInfo._id)

        res.json({
            message: "List of community information available for**** ",
            communeInfo

        })

    } catch (error) {
        console.log("Error while getting data for activity", error)

        res.json({
            message: "Error while getting data for activity",
            error
        })
    }
})

module.exports = {
    getUserList,
    getTelephoneNum,
    signupNewUser,
    login,
    payment,
    getActivityList,
    getCommuneList,
    getCommuneInfo
}