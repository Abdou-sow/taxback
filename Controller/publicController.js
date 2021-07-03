const express = require('express');
const router = express.Router();

const { validationResult } = require('express-validator');  // to process error results

const communeModel = require('../Model/communeModel');
const activityModel = require('../Model/activityModel');



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