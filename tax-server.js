const express = require('express');
const cors = require("cors")
const mongoose = require('mongoose');
const app = express();

const userModel = require('./Model/userModel')
const router = require('./Routes/taxRoutes');

app.use(cors());
app.use(express.json());

const port = 9001;

mongoose.connect("mongodb://localhost:27017/tax-commune", { useNewUrlParser: true }, { useUnifiedTopology: true }, (err) => {
    if (err) {
        console.error(err)
    } else {
        console.log("Connecte");
    }
});

app.use("/", router)

app.listen(port, () => {
    console.log("Ecoute en port: ", port)
})