const express = require('express');
const router = express.Router();

const { validationResult } = require('express-validator');  // to process error results

const bcrypt = require('bcryptjs');     // to crypt sensible datas
const jwt = require('jsonwebtoken');    // to create jsonwebtoken

const userModel = require('../Model/userModel');
const paymentModel = require('../Model/paymentModel')
const communeModel = require('../Model/communeModel');
const activityModel = require('../Model/activityModel');

const getUserList = (async (req, res) => {

    try {

        // find all records in user and their activity name and prix details from user and activity collection

        const userList = await userModel.find().populate({ path: 'activityID', select: ['name', 'prix'] }).select(
            {
                _id: 1,
                surname: 1,
                firstname: 1,
                dateofbirth: 1,
                address_personal: 1,
                address_activity: 1,
                activityID: 1,
                activity_communeID: 1,
                telephone: 1
            },
        ).lean()

        res.json({
            message: "List of users currently available in database",
            userList
        })

    } catch (error) {

        res.status(400).json({
            message: "Error while getting user list",
            error
        })
    }
})

const modificationUserInfo = (async (req, res) => {

    try {

        // update user information by given telephone number

        const errorVal = validationResult(req);

        const oldTelephone = req.params.telephone
        const newTelephone = req.body.telephone
        const newFirstname = req.body.firstname
        const newsurname = req.body.surname
        const newAddresspersonal = req.body.address_personal

        if (errorVal.isEmpty()) {

            const telephoneExist = await userModel.findOne({ telephone: req.params.telephone }).lean()

            if (telephoneExist) {

                const updateUserInfo = await userModel.updateOne({ _id: telephoneExist._id },            // not working
                    {
                        "$set": {
                            "telephone": newTelephone,
                            "firstname": newFirstname,
                            "surname": newsurname,
                            "address_personal": newAddresspersonal
                        }
                    }, { upsert: true }).lean()

                const updatedInfo = await userModel.findOne({ _id: telephoneExist._id }).select(
                    {
                        _id: 1,
                        surname: 1,
                        firstname: 1,
                        address_personal: 1,
                        address_activity: 1,
                        telephone: 1
                    }).lean()

                res.json({
                    message: `Telephone number ${oldTelephone} replaced with ${newTelephone} number`,
                    updatedInfo
                })

            } else {

                res.json({
                    message: `User telephone number ${req.params.telephone} does not exist in the list`
                })
            }

        } else {

            res.json({
                message: `Error while processing your ${oldTelephone, newTelephone, newFirstname, newsurname, newAddresspersonal}`,
                errorVal
            })
        }

    } catch (error) {

        res.status(400).json({
            message: "Error while updating user information",
            errorVal
        })
    }
})

const getTelephoneNum = (async (req, res) => {

    try {
        // find user given telephone number record from user list

        const validUser = await userModel.findOne({ telephone: req.params.telephone }).select(
            {
                _id: 1,
                surname: 1,
                firstname: 1,
                dateofbirth: 1,
                address_personal: 1,
                address_activity: 1,
                activityID: 1,
                activity_communeID: 1,
                telephone: 1
            }).lean()

        const activity = validUser.activityID
        const commune = validUser.activity_communeID

        const userActivityName = await activityModel.findById(activity).exec()
        const userCommuneName = await communeModel.findById(commune).exec()

        const userActivity = userActivityName.name
        const userActivityPrix = userActivityName.prix
        const activityCommune = userCommuneName.name

        if (validUser) {

            res.json({
                message: "User Found",
                validUser,
                userActivity,
                userActivityPrix,
                activityCommune
            })

        } else {

            res.status(400).json({
                message: "User not found",
                validUser

            })
        }

    } catch (error) {

        res.status(400).json({
            message: "Error while verifing the user telephone number",
            error
        })
    }
})

const payment = (async (req, res) => {

    try {

        const errorVal = validationResult(req);

        const userTelephone = req.body.telephone;
        const userAmount = req.body.amount;
        const paidOn = new Date()

        // pick user information from collection

        if (errorVal.isEmpty()) {

            const userInfo = await userModel.findOne({ telephone: userTelephone })

            if (userInfo) {

                const userId = userInfo._id

                const paymentuserID = await paymentModel.findOne({ userId: userId })

                if (paymentuserID) {

                    const paymentMade = await paymentModel.create(
                        {
                            userId: paymentuserID.userId,
                            amount: userAmount,
                            paidon: paidOn
                        })

                    res.json({
                        message: "Payment added successfully",
                        paymentMade
                    })

                } else {

                    res.status(400).json({
                        message: "User is not registered or user information not correct, payment cancelled",
                        userInfo
                    })
                }
            } else {

                res.status(400).json({
                    message: "User is not registered or payment details not provided, payment cancelled",
                    userTelephone,
                    userAmount
                })
            }

        } else {

            res.json({
                message: `Error while processing your ${userTelephone} and ${userAmount}, payment cancelled`,
                errorVal
            })
        }

    } catch (error) {

        res.status(400).json({
            message: `Error while processing your ${userTelephone} and ${userAmount}, payment cancelled`,
            errorVal
        })
    }
})

const getPaymentByUser = (async (req, res) => {

    try {

        const user = req.params.telephone

        // find user given telephone number record from user list

        const userExist = await userModel.findOne({ telephone: req.params.telephone }).select(
            {
                _id: 1,
                telephone: 1,
                surname: 1,
                firstname: 1,
                address_activity: 1
            }).lean()

        if (userExist) {

            const userID = userExist._id;
            
            // find all payment made by user based on userID

            const userPaymentList = await paymentModel.find(
                { userId: userID }).select({ _id: 1, amount: 1, paidon: 1 }).lean()

            res.json({
                message: "Payment Details",
                user,
                userID,
                userPaymentList
            })
        } else {

            res.status(400).json({
                message: "User not found",
                telephoneExist

            })
        }
    } catch (error) {
        
        res.json({
            message: "Error while verifing the user telephone number",
            error
        })
    }
})

const getAllUsersPayment = (async (req, res) => {

    try {

        const userPaymentList1 = await paymentModel.aggregate([{
            $lookup: {
                from: "User",
                localField: "userId",
                foreignField: "_id",
                as: "paymentList"

            }
        }])

        const userPaymentList2 = await paymentModel.find().populate({ path: 'userId', select: ['firstname', 'surname', 'telephone'] }).select(
            {
                userId: 1,
                amount: 1,
                paidon: 1
            },
        ).lean()

        res.json({
            message: "List of all paid users",
            userPaymentList2
        })

    } catch (error) {
        
        res.status(400).json({
            message: "Error while verifing the user telephone number",
            error
        })
    }
})

const getCommuneInfo = (async (req, res) => {

    try {
        // get information for given commune from commune collection    // 

        const communeInfo = await communeModel.findOne({ name: req.params.name }).select(
            {
                _id: 1,
                name: 1,
                information: 1
            }).lean()

        res.json({
            message: `Details about ${req.params.name} commune`,
            communeInfo

        })

    } catch (error) {
        console.log("Error while getting data for activity", error)

        res.status(400).json({
            message: "Error while getting data for activity",
            error
        })
    }
})

module.exports = {
    getUserList,
    getTelephoneNum,
    modificationUserInfo,
    payment,
    getCommuneInfo,
    getPaymentByUser,
    getAllUsersPayment
}