const express = require('express');
const router = express.Router();

const { validationResult } = require('express-validator');  // to process error results

const communeModel = require('../Model/communeModel');
const activityModel = require('../Model/activityModel');

const getActivityList = (async (req, res) => {

    try {

        console.log("Im in getActivityList", req.body)

        // find all records in activity collection

        const list = await activityModel.find().select(
            {
                name: 1,
                prix: 1

            })

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

    try {

        console.log("Im in getCommuneList", req.body)

        // find all records in commune collection

        const list = await communeModel.find().select(
            {
                _id: 1,
                name: 1,
                information: 1
            }).lean()

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
    getCommuneAccueilInfo,
    getActivityList,
    getCommuneList
}