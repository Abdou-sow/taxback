const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for activity
const communeSchema = new Schema(
    {
        name: { type: String, unique: true, require: true },
        information: { type: String, max:750 },
        created: { type: Date, default: Date.now }
    }
);

const communeModel = mongoose.model("Commune", communeSchema);

module.exports = communeModel;   // commune export