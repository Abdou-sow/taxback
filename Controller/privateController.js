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

    console.log("En getUserList controller", req.body)

    try {
        // find all records in user collection

        const userlist = await userModel.find().select(
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

const modificationUserInfo = (async (req, res) => {

    try {

    const errorVal = validationResult(req);

    console.log("Im in modificationUserInfo", req.params.telephone)
    console.log("New telephone number ", req.body.telephone)

    const oldTelephone = req.params.telephone
    const newTelephone = req.body.telephone
    const newFirstname = req.body.firstname
    const newsurname = req.body.surname
    const newAddresspersonal = req.body.address_personal
    console.log("newAddresspersonal", newAddresspersonal)

    // return res.json()


        // update user information by given telephone number
        const telephoneExist = await userModel.findOne({ telephone: req.params.telephone }).lean()

        if (telephoneExist) {

            console.log(`${req.params.telephone} telephone number exist and _id for this telephone is ${telephoneExist._id}`)

            // const updateUserInfo = await userModel.updateOne({ _id: telephoneExist._id }, { telephone: req.body.telephone }) //working

            const updateUserInfo = await userModel.updateOne({_id: telephoneExist._id},            // not working
                {
                    "$set": {
                        "telephone": newTelephone,
                        "firstname": newFirstname,
                        "surname": newsurname,
                        "address_personal": newAddresspersonal
                    }
                }, {upsert: true}).lean()

            console.log("updateUserInfo", updateUserInfo)

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
            console.log("User telephone number does not exist in the list", req.params.telephone)

            res.json({
                message: `User telephone number ${req.params.telephone} does not exist in the list`
            })
        }

    } catch (error) {
        console.error("Error while updating user information", error)
    }

})

//************* */

// const updateUserInfo = await userModel.useFindAndModify(telephoneExist._id ,            // not working
//     { telephone: newTelephone, 
//      firstname: newFirstname, 
//      surname: newsurname, 
//   

// {
//     "telephone":148389999,
//     "firstname": "boris",
//     "surname": "johnson",
//     "address_personal": "no10 dowining street,london"
// }

//************* */



const getTelephoneNum = (async (req, res) => {

    console.log("Im in getTelephoneNum", req.params.telephone)

    try {
        // find user given telephone number record from user list

        const telephoneExist = await userModel.findOne({ telephone: req.params.telephone }).select(
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

        console.log("userfound", telephoneExist)

        const activity = telephoneExist.activityID
        const commune = telephoneExist.activity_communeID

        const userActivityName = await activityModel.findById(activity).exec()
        const userCommuneName = await communeModel.findById(commune).exec()

        const userActivity = userActivityName.name
        const userActivityPrix = userActivityName.prix
        const activityCommune = userCommuneName.name

        console.log("userActivityName ", userActivity)
        console.log("activityCommune ", activityCommune)

        if (telephoneExist) {

            res.json({
                message: "User Found",
                telephoneExist,
                userActivity,
                userActivityPrix,
                activityCommune
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
    const paidOn = new Date()

    try {
        // pick user information from collection
        
        const userInfo = await userModel.findOne({ telephone: userTelephone })
        
        if(userInfo) {
            
            const userId = userInfo._id
            console.log("userId", userId)

            const paymentuserID = await paymentModel.findOne({ userId: userId })
    
            console.log("paymentuserID", paymentuserID.userId)
    
            if (paymentuserID) {
    
                // const currentPaymetStatus = await paymentModel.updateOne(
                //     { userId: paymentuserID.userId },
                //     { $push: { payment: { amount: userAmount, paidon: paidOn } } }
                // )
    
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
                    message: "User is not registered or user information not available, payment cancelled",
                    userInfo
                })
            }
        } else {

            console.error("User is not registered or payment details not provided, payment cancelled")
            res.status(400).json({
                message: "User is not registered or payment details not provided, payment cancelled",
                userInfo
            })

        }

    } catch (error) {
        console.log("Error while making payment", error)
    }
})

const getPaymentByUser = (async (req, res) => {

    console.log("Im in getPaymentByUser", req.params.telephone)

    const user = req.params.telephone

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


            // find all payment made by user based on userID

            const userPaymentList = await paymentModel.find(
                { userId: userID }).select({ _id: 1, amount: 1, paidon: 1 }).lean()

            console.log("userPaymentList", userPaymentList)

            //******* */
            // const userPaymentList = await paymentModel.aggregate([
            //     { $lookup: 
            //     {
            //         from: 'user',
            //         localField: 'userId',
            //         foreignField: '_id',
            //         as: 'payment'                    
            //     }}
            // ])
            //******* */

            //******* */
            // const paymentMade = await paymentModel.aggregate([
            //     {
            //         $group: {
            //             _id: "$amount",
            //             timesPaid: { $sum: 1 }
            //         }
            //     }
            // ])
            // console.log("paymentMade", paymentMade)
            //******* */

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
        console.log("Error while verifing the user telephone number")

        res.json({
            message: "Error while verifing the user telephone number",
            error
        })
    }
})

const getAllUsersPayment = (async (req, res) => {

    console.log("Im in getPaymentForAllUsers", req.body)

    try {

        const userPaymentList = await paymentModel.find().select(
            {
                userId: 1,
                amount: 1,
                paidon: 1
            }
        ).lean()
        // console.log("userPaymentList", userPaymentList)


        res.json({
            message: "List of all paid users",
            userPaymentList
        })

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
        // get information for given commune from commune collection    // 

        const communeInfo = await communeModel.findOne({ name: req.params.name }).select(
            {
                _id: 1,
                name: 1,
                information: 1
            }).lean()

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
    modificationUserInfo,
    payment,
    getCommuneInfo,
    getPaymentByUser,
    getAllUsersPayment
}