const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for activity
const activitySchema = new Schema(
    {
        name: { type: String, unique: true, require: true },
        prix: {type: Number, require: true},
        created: { type: Date, default: Date.now }
    }
);

const activityModel = mongoose.model("Activity", activitySchema);

module.exports = activityModel;   // activity export