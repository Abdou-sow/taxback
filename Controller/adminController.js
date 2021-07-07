const express = require('express');
const router = express.Router();

const { validationResult } = require('express-validator');  // to process error results

const bcrypt = require('bcryptjs');     // to crypt sensible datas
const jwt = require('jsonwebtoken');    // to create jsonwebtoken

const adminModel = require('../Model/adminModel');
const userModel = require('../Model/userModel');

const getAdminList = (async (req, res) => {

    try {

        // find all records in admin collection

        const userlist = await adminModel.find().select(
            {
                _id: 1,
                surname: 1,
                firstname: 1,
                role: 1,
                telephone: 1
            }).lean()

        res.json({
            message: "List of administrators currently available in database",
            userlist
        })

    } catch (error) {

        res.status(400).json({
            message: "Error while getting admins list",
            error
        })
    }
})

const deleteUser = (async (req, res) => {

    try {

        const userID = req.params.id
        console.log("In getAdmimList controller", userID )

        // check is the user is exist

        const userExist = await userModel.findById(userID).lean()
        
        if(userExist) {
            
            console.log(userExist)
            
            // find and delete user by given _id

            const userDeleted= await userModel.findByIdAndDelete({ _id: userID }).exec()

            res.json({
                    message: "List of administrators currently available in database",
                    userDeleted
                })
        }

    } catch (error) {

        res.status(400).json({
            message: "Error while getting admins list",
            error
        })
    }
})

module.exports = {
    getAdminList,
    deleteUser
}