const mongoose = require('mongoose');
const userModel = require('./Model/userModel');
const communeModel = require('./Model/communeModel');
const activityModel = require('./Model/activityModel')
// const communeInfoModel = require('./Model/communeInfoModel');
const paymentModel = require('./Model/paymentModel');
// const communePageModel = require('./Model/communePageModel');
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
                information: "Les Champs-Élysées sont une avenue vraiment charmante : une scène de carte postale. Longue de près de 2 kilomètres, cette artère historique s'étend de la place de la Concorde au majestueux Arc de Triomphe. Bien qu'elle soit devenue depuis \"la plus belle avenue du monde\", les Champs-Élysées étaient autrefois un marécage. C'est au XVIIe siècle qu'André Le Nôtre, jardinier du Roi Soleil, en a tracé le chemin originel. Une légende est née. L'avenue n'a fait que s'embellir au fil des décennies."
            
            },
            {
                name: "bagnolet",
                information: "La ville est située dans le Bassin parisien, dans la région Île-de-France. Elle est limitrophe de Paris, en banlieue est, dans le sud du département de la Seine-Saint-Denis. Elle fait partie de la petite couronne de Paris.Bagnolet est situé à moins de 6 km, à vol d'oiseau, de Notre-Dame de Paris1."
            },
            {
                name: "lilas",
                information: "La ville est située sur la colline de Belleville dans la banlieue nord-est de Paris, au sud-ouest du département de la Seine-Saint-Denis. Sur son territoire se situe le point culminant du département, avec 131 mètres."
            },
            {
                name: "rue de rivoli",
                information: "rivoli"
            },
            {
                name: "passages couverts",
                information: "pass couverts"
            },
            {
                name: "rue de la paix",
                information: "rue paix"
            },
            {
                name: "avenue de l’opéra",
                information: "l’opéra"
            },
            {
                name: "rue soufflot",
                information: "soufflot"
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
        const communeDetails1 = await communeModel.findOne({ name: "rue de rivoli" }).lean()     // take commune id to save in with user collection

        const activityDetails = await activityModel.findOne({ name: "vendeur" }).lean()  // take activity id to save in with user collection
        const activityDetails1 = await activityModel.findOne({ name: "pharmacien" }).lean()  // take activity id to save in with user collection
        


        console.log("activityDetails", activityDetails)
        console.log("activityDetails", activityDetails1)
        console.log("communeDetails", communeDetails)
        console.log("communeDetails", communeDetails1)

        await userModel.deleteMany({}).lean()

        await userModel.insertMany([

            {
                surname: "macron",
                firstname: "emmanualle",
                dateofbirth: "2000/12/12",
                address_personal: "12 elyse palace",
                address_activity: "paris",
                activity_communeID: communeDetails._id,
                activityID: activityDetails._id,
                telephone: "148381111",
                password: passwordHash
            }
        ])

        console.log("The collection of User has been recreated with the database");

        setTimeout(function () { addPayment() }, 3000 );     // will wait to get updated adduser collection to avoid promise error

    } catch (err) {
        console.log(err)
    }
}
// create payment collection

const addPayment = async () => {

    try {

        const defaultUser = "148381111";    // user signed in telephone number

        const userDetails = await userModel.findOne({ telephone: defaultUser }).lean()     // take commune id to save in with user collection
        
        console.log("userDetails", userDetails)

        console.log("User _id is ", userDetails._id)

        // console.log("Date.now", new Date().toISOString().split('T')[0])

        await paymentModel.deleteMany({}).lean()

        await paymentModel.insertMany([

            {
                userId: userDetails._id,
                amount: "5",
                paidon: new Date()
            }
        ])

        console.log("The collection of Payment has been recreated with the database");


    } catch (err) {
        console.log(err)
    }
}

addActivity();

addCommune();

setTimeout(function () { addUser() }, 3000);        // will wait to get updated activity/commune collection to avoid promise error