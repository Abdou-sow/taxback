const express = require('express');
const router = express.Router();

const { validationResult } = require('express-validator');  // to process error results

const bcrypt = require('bcryptjs');     // to crypt sensible datas
const jwt = require('jsonwebtoken');    // to create jsonwebtoken

const adminModel = require('../Model/adminModel');

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

        // console.log("Error en user list", error)

        res.status(400).json({
            message: "Error while getting admins list",
            error
        })
    }
})

module.exports = {
    getAdminList
}