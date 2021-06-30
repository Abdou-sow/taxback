const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for activity

const activitySchema = new Schema(
    {
        name: { type: String, require: true }
    }
);

const activityModel = mongoose.model("Activity", activitySchema);

module.exports = activityModel;   // activity export