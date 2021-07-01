const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for user
const userSchema = new Schema(
    {
        surname: { type: String, require: true },
        firstname: { type: String, require: true },
        dateofbirth: { type: Date },
        address_personal: { type: String, max: 200 },
        address_activity: { type: String, max: 200 },
        // personal_communeID: { type: String, require: true },
        // activityID: { type: String, require: true },
        activity_communeID: {
            type: mongoose.Types.ObjectId,
            ref: "Commune"
        },
        activityID: {
            type: mongoose.Types.ObjectId,
            ref: "Activity"
        },
        telephone: { type: Number, unique: true, require: true },
        password: { type: String, require: true, min: 6, max: 15 },
        created: { type: Date, default: Date.now }
    }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;   // user export
