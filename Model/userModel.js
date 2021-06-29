const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for user
const userSchema = new Schema(
    {
        nom: { type: String, require: true },
        prenom: { type: String, require: true },
        naissance: { type: Date },
        address_perso: { type: String, max: 50 },
        address_activite: { type: String, max: 50 },
        activite: { type: String, require: true },
        commune: { type: String, require: true },
        telephone: { type: Number, unique: true, require: true },
        password: { type: String, require: true, min: 6, max: 15 }
    }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;   // user export
