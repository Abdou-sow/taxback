const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for activity
const communeSchema = new Schema(
    {
        name: { type: String, require: true },
        codepostal: { type: Number },
        created: { type: Date, default: Date.now }
    }
);

const communeModel = mongoose.model("Commune", communeSchema);

module.exports = communeModel;   // commune export