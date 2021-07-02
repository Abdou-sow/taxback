const express = require('express');
const router = express.Router();

const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');     // to crypt sensible datas
const jwt = require('jsonwebtoken');    // to create jsonwebtoken

const userModel = require('../Model/userModel');
const activityModel = require('../Model/activityModel')
const communeModel = require('../Model/communeModel');
const paymentModel = require('../Model/paymentModel');

const getUserList = (async (req, res) => {

    console.log("En getUserList controller", req.body)

    try {

        const userlist = await userModel.find({})       // find all records in user collection

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

    console.log("Im in getTelephoneNum", req.params.telephone)

    try {

        const telephoneExist = await userModel.findOne({ telephone: req.params.telephone }).lean()     // find user given telephone number record from user list
        // const telephoneExist = await userModel.find().populate("Activity", { name:1, _id:0}).select({
        //     surname: 1,
        //     firstname:1,
        //     dateofbirth: 1,
        //     address_activity: 1,
        //     telephone: 1
        // })
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
        const list = await activityModel.find({})       // find all records in activity collection

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
        const list = await communeModel.find({})        // find all records in commune collection

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

    const tokenExpire = "300s"      // setting for token expires in 300s(5 minutes)

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
                id: telephoneExist.id
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

        const userInfo = await userModel.findOne({ telephone: userTelephone })      // pick user information from collection

        if (userInfo) {

            console.log("User, Commune and Activity Commune", userInfo.telephone, userInfo.communeID, userInfo.activityID);

            // add new payment 
            const addPayment = await paymentModel.create(
                {
                    userId: userInfo._id,
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

const getPaymentByUser = (async (req, res) => {

    console.log("Im in getPaymentByUser", req.params.telephone)

    try {

        const telephoneExist = await userModel.findOne({ telephone: req.params.telephone }).lean()     // find user given telephone number record from user list
        // const telephoneExist = await userModel.find().populate("Activity", { name:1, _id:0}).select({
            //     surname: 1,
            //     firstname:1,
            //     dateofbirth: 1,
            //     address_activity: 1,
            //     telephone: 1
            // })
            console.log("userfound", telephoneExist)
            
            if(telephoneExist) {
                
                const userID = telephoneExist._id;
                console.log("userID and his telephone number is", userID, telephoneExist.telephone);
                
                const userPaymentList = await paymentModel.find({ userId: userID }).lean()     // find all payment made by user based on his userID
                console.log(userPaymentList)

            res.json({
                message: "User Found",
                telephoneExist,
                userPaymentList
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


const getCommuneInfo = (async (req, res) => {

    console.log("Im in getCommuneInfo", req.params.name)

    try {

        const communeInfo = await communeModel.findOne({ name: req.params.name })   // get information for given commune from commune collection    // 

        console.log(communeInfo)

        res.json({
            message: "Detail of commune ",
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

const getCommuneAccueilInfo = (async (req, res) => {

    console.log("Im in getCommuneInfo", req.params.name)

    try {

        const communeID = await communeModel.findOne({ name: req.params.name })   // get information for given commune from commune collection    // 

        console.log("communeInfo", communeID.name)
        console.log("communeInfo", communeID._id)
        console.log("communeInfo", communeID.information)

        res.json({
            message: "List of community information available for**** ",
            communeID

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
    getCommuneInfo,
    getPaymentByUser,
    getCommuneAccueilInfo
}