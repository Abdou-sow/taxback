const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for activity
const communeSchema = new Schema(
    {
        commune: { type: String, require: true },
        codepostal: { type: Number }
    }
);

const communeModel = mongoose.model("Commune", communeSchema);

module.exports = communeModel;   // commune export