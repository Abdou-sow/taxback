const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for user
const paymentSchema = new Schema(
    {
        userId: { type: mongoose.Types.ObjectId,
        ref: "User"},
        // amount: [{ type: Number, require: true }],       // add as array without _id
        // datepaid: [{type:Date }],
        payment: [{                                          // add as array with _id
            amount: {type: Number},
            paidon: {type: Date}
        }],
        created: { type: Date, default: Date.now }
    }
);

const paymentModel = mongoose.model("Payment", paymentSchema);

module.exports = paymentModel;   // payment export