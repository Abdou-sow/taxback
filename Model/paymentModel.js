const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for user
const paymentSchema = new Schema(
    {
        telephone: { type: Number, require: true },
        communeID: { type: String, require: true },
        activityID: { type: String, require: true },
        date: { type: Date, efault: Date.now },
        amount: { type: Number, require: true },
        created: { type: Date, default: Date.now }
    }
);

const paymentModel = mongoose.model("Payment", paymentSchema);

module.exports = paymentModel;   // payment export
