const mongoose = require('mongoose');
const userModel = require('./Model/userModel');
const Commune = require('./Model/communeModel');
const Activity = require('./Model/activityModel');
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

        console.log("The collection of User are recreated with the database");

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
                    activity: "Test Activity",
                    prix:5
                },
                // {
                //     activity: "magasinier",
                //     prix:6
                // },
                // {
                //     activity: "coiffure",
                //     prix:4
                // },
                // {
                //     activity: "commercant",
                //     prix:10
                // },
                // {
                //     activity: "marchee",
                //     prix:6
                // }
        ])

        console.log("The collection of Activity are recreated with the database");

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
                    commune: "Test Commune",
                    region: "paris",
                    codepostal:"10000"
                },
                // {
                //     commune: "lilas",
                //     region: "paris",
                //     codepostal:"75002"
                // },
                // {
                //     commune: "gambetta",
                //     region: "paris",
                //     codepostal:"75003"
                // },
                // {
                //     commune: "chapelle",
                //     region: "paris",
                //     codepostal:"75004"
                // },
                // {
                //     commune: "drancy",
                //     region: "saint denis",
                //     codepostal:"93001"
                // },
                // {
                //     commune: "chatelet",
                //     region: "paris",
                //     codepostal:"75005"
                // }
        ])

        console.log("The collection of Commune are recreated with the database");

    } catch (err) {
        console.log(err)
    }
}

addUser();
addActivity();
addCommune();
