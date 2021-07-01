const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for user
const paymentSchema = new Schema(
    {
        amount: { type: Number, require: true },
        created: { type: Date, default: Date.now }
    }
);

const paymentModel = mongoose.model("Payment", paymentSchema);

module.exports = paymentModel;   // payment export
