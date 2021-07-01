const mongoose = require('mongoose');
const userModel = require('./Model/userModel');
const communeModel = require('./Model/communeModel');
const activityModel = require('./Model/activityModel')
const communeInfoModel = require('./Model/communeInfoModel');
const paymentModel = require('./Model/paymentModel');
const bcrypt = require('bcryptjs');

// connect to database

mongoose.connect("mongodb://localhost:27017/tax-commune", { useNewUrlParser: true }, { useUnifiedTopology: true }, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("I'm connected to the database")
    }
})

// create activity collection 

const addActivity = async () => {

    try {

        await activityModel.deleteMany({}).lean()

        await activityModel.insertMany([

            {
                name: "bijoutier",
                prix: 5
            },
            {
                name: "coiffeur",
                prix: 5
            },
            {
                name: "électricien",
                prix: 5
            },
            {
                name: "cuisinier",
                prix: 5
            },
            {
                name: "cordonnier",
                prix: 5
            },
            {
                name: "pharmacien",
                prix: 5
            },
            {
                name: "mécanicien",
                prix: 5
            },
            {
                name: "plombier",
                prix: 5
            },
            {
                name: "technicien",
                prix: 5
            },
            {
                name: "vendeur",
                prix: 5
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

        await communeModel.deleteMany({}).lean()

        await communeModel.insertMany([

            {
                name: "champs-elysées",
                region: "paris",
                codepostal: "75008"
            },
            {
                name: "avenue victor hugo",
                region: "paris",
                codepostal: "75116"
            },
            {
                name: "avenue montaigne",
                region: "paris",
                codepostal: "75008"
            },
            {
                name: "rue de rivoli",
                region: "paris",
                codepostal: "75004"
            },
            {
                name: "passages couverts",
                region: "paris",
                codepostal: "75008"
            },
            {
                name: "rue de la paix",
                region: "paris",
                codepostal: "75002"
            },
            {
                name: "avenue de l’opéra",
                region: "paris",
                codepostal: "75001"
            },
            {
                name: "rue soufflot",
                region: "paris",
                codepostal: "75005"
            }
        ])

        console.log("The collection of Commune has been recreated with the database");

    } catch (err) {
        console.log(err)
    }
}

// create user collection 

const addUser = async () => {

    const password = "!As1234567890"
    const passwordHash = bcrypt.hashSync(password)

    console.log(password, passwordHash)

    try {

        const communeDetails = await communeModel.findOne({ name: "champs-elysées" }).lean()     // take commune id to save in with user collection

        const activityDetails = await activityModel.findOne({ name: "vendeur" }).lean()  // take activity id to save in with user collection

        console.log("activityDetails", activityDetails)
        console.log("communeDetails", communeDetails)

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
                activity: "vendeur",
                activityID: activityDetails._id,
                commune: "champs-elysées",
                communeID: communeDetails._id,
                telephone: "148381111",
                password: passwordHash
            }
        ])

        console.log("The collection of User has been recreated with the database");

    } catch (err) {
        console.log(err)
    }
}
// create payment collection

const addPayment = async () => {

    try {

        const communeDetails = await communeModel.findOne({ name: "champs-elysées" }).lean()     // take commune id to save in with user collection
        const activityDetails = await activityModel.findOne({ name: "vendeur" }).lean()  // take activity id to save in with user collection

        // console.log("communeDetails", communeDetails)

        // console.log("activityDetails", activityDetails)

        await paymentModel.deleteMany({}).lean()

        await paymentModel.insertMany([

            {
                telephone: "148381111",
                communeID: communeDetails._id,
                activityID: activityDetails._id,
                date: "2021/06/06",
                amount: "10"
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

        const communeDetails = await communeModel.findOne({ name: "champs-elysées" }).lean()     // take commune id to save in with user collection
        // console.log("communeDetails", communeDetails)

        await communeInfoModel.deleteMany({}).lean()

        await communeInfoModel.insertMany([

            {
                communeID: communeDetails._id,
                date: "2021/06/06",
                travaux: "decoration",
                place: "rue paster",
                amount_spent: "5000"
            }
        ])

        console.log("The collection of CommuneInfo has been recreated with the database");

    } catch (err) {
        console.log(err)
    }
}

addActivity();
addCommune();
setTimeout(function () { addUser() }, 3000);        // will wait to get updated activity/commune collection to avoid promise error
setTimeout(function () { addPayment() }, 3000);     // will wait to get updated adduser collection to avoid promise error
setTimeout(function () { addCommuneInfo() }, 3000); // will wait to get updated addcommune collection to avoid promise error


