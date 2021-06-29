const mongoose = require('mongoose');
const User = require('./Model/userModel');
const bcrypt = require('bcryptjs');

// connect to database

mongoose.connect("mongodb://localhost:27017/tax-commune", { useNewUrlParser: true }, { useUnifiedTopology: true }, (err) => {  
    if (err) {
        console.log(err);
    } else {
        console.log("I'm connected to the database")
    }
})

// create collection 

const addUser = async () => {

    const password = "!As1234567890"
    const passwordHash = bcrypt.hashSync(password)

    console.log(password, passwordHash)

    try {
        
        await User.deleteMany({}).lean()

        await User.insertMany([

                {
                    surname: "macron",
                    firstname: "emmanualle",
                    dateofbirth: "2000/12/12",
                    address_personal: "12 elyse palace",
                    address_work: "paris",
                    activity: "problem toujour",
                    commune: "champs Elysee",
                    telephone: "148381111",
                    password: passwordHash
                }
        ])

        console.log("The collection of Hotels are recreated with the database");

    } catch (err) {
        console.log(err)
    }
}

addUser(); 
