const mongoose = require('mongoose');
const userModel = require('./Model/userModel');
const Commune = require('./Model/communeModel');
const Activity = require('./Model/activityModel');
const CommuneInfo = require('./Model/communeInfoModel');
const Payment = require('./Model/paymentModel');
const bcrypt = require('bcryptjs');

// connect to database

mongoose.connect("mongodb://localhost:27017/tax-commune", { useNewUrlParser: true }, { useUnifiedTopology: true }, (err) => {  
    if (err) {
        console.log(err);
    } else {
        console.log("I'm connected to the database")
    }
})

// create user collection 

const addUser = async () => {

    const password = "!As1234567890"
    const passwordHash = bcrypt.hashSync(password)

    console.log(password, passwordHash)

    try {
        
        await userModel.deleteMany({}).lean()

        await userModel.insertMany([

                {
                    surname: "macron",
                    firstname: "emmanualle",
                    dateofbirth: "2000/12/12",
                    address_personal: "12 elyse palace",
                    personal_codepostal: "75001",
                    address_activity: "paris",
                    activity_codepostal: "75002",
                    activity: "problem toujour",
                    activityID: "1A001",
                    commune: "champs Elysee",
                    communeID: "1C001",
                    telephone: "148381111",
                    password: passwordHash
                }
        ])

        console.log("The collection of User has been recreated with the database");

    } catch (err) {
        console.log(err)
    }
}

// create activity collection 

const addActivity = async () => {

    try {
        
        await Activity.deleteMany({}).lean()

        await Activity.insertMany([

                {
                    name: "Test Activity",
                    prix:5
                }
        ])

        console.log("The collection of Activity has been recreated with the database");

    } catch (err) {
        console.log(err)
    }
}

// create activity collection 

const addCommune = async () => {

    try {
        
        await Commune.deleteMany({}).lean()

        await Commune.insertMany([

                {
                    name: "Test Commune",
                    region: "paris",
                    codepostal:"10000"
                }
        ])

        console.log("The collection of Commune has been recreated with the database");

    } catch (err) {
        console.log(err)
    }
}

// create payment collection

const addPayment = async () => {

    try {
        
        await Payment.deleteMany({}).lean()

        await Payment.insertMany([

                {
                    telephone: "148381111",
                    communeID: "1C001",
                    date: "2021/06/06",
                    amount:"10"
                }
        ])

        console.log("The collection of Payment has been recreated with the database");

    } catch (err) {
        console.log(err)
    }
}

// create communeInfo collection

const addCommuneInfo = async () => {

    try {
        
        await CommuneInfo.deleteMany({}).lean()

        await CommuneInfo.insertMany([

                {
                    communeID: "1C001",
                    date: "2021/06/06",
                    travaux: "decoration",
                    place:"rue paster",
                    amount_spent:"5000"
                }
        ])

        console.log("The collection of CommuneInfo has been recreated with the database");

    } catch (err) {
        console.log(err)
    }
}

addUser();
addActivity();
addCommune();
addPayment();
addCommuneInfo();
