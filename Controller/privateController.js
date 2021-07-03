const express = require('express');
const router = express.Router();

const { validationResult } = require('express-validator');  // to process error results

const bcrypt = require('bcryptjs');     // to crypt sensible datas
const jwt = require('jsonwebtoken');    // to create jsonwebtoken

const userModel = require('../Model/userModel');
const paymentModel = require('../Model/paymentModel')
const communeModel = require('../Model/communeModel');


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

        console.log("userfound", telephoneExist)

        if (telephoneExist) {

            res.json({
                message: "User Found",
                telephoneExist
            })
        } else {

            res.status(400).json({
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

            res.status(400).json({
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

        // find user given telephone number record from user list

        const telephoneExist = await userModel.findOne({ telephone: req.params.telephone }).select(
            {
                _id: 1,
                telephone: 1,
                surname: 1,
                firstname: 1,
                address_activity: 1
            }).lean()

        console.log("userfound", telephoneExist)

        if (telephoneExist) {

            const userID = telephoneExist._id;
            console.log("userID and his telephone number is", userID, telephoneExist.telephone);

            // find all payment made by user based on his userID

            const userPaymentList = await paymentModel.find(
                {
                    userId: userID
                }).select(
                    { userId: 1, amount: 1, created: 1 }
                ).lean()

            console.log("userPaymentList", userPaymentList)

            // const paymentMade = await paymentModel.aggregate([
            //     {
            //         $group: {
            //             _id: "$amount",
            //             timesPaid: { $sum: 1 }
            //         }
            //     }
            // ])
            // console.log("paymentMade", paymentMade)

            res.json({
                message: "User Found",
                telephoneExist,
                userPaymentList
            })
        } else {

            res.status(400).json({
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

const getAllUsersPayment = (async (req, res) => {

    console.log("Im in getPaymentByUser", req.body)

    try {

        const telephoneExist = await userModel.find(
            {
                telephone: 1,
                surname: 1,
                firstname: 1,
                address_activity: 1
            }).lean()     // find user given telephone number record from user list

        const paymentMade = await paymentModel.aggregate([
            {
                $group: {
                    _id: "$amount",
                    timesPaid: { $sum: 1 }
                },
            }
        ])
        console.log("paymentMade", paymentMade)

        res.json({
            message: "List of all paid users",
            telephoneExist,
            paymentMade
        })

        // if (telephoneExist) {

        //     const userID = telephoneExist._id;
        //     console.log("userID and his telephone number is", userID, telephoneExist.telephone);

        //     const userPaymentList = await paymentModel.find({ userId: userID }).lean()     // find all payment made by user based on his userID
        //     console.log(userPaymentList)

        //     res.json({
        //         message: "User Found",
        //         telephoneExist,
        //         userPaymentList
        //     })
        // } else {

        //     res.status(400).json({
        //         message: "User not found",
        //         telephoneExist

        //     })
        // }

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
    payment,
    getCommuneInfo,
    getPaymentByUser
}