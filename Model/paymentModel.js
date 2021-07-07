const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for user, userId have relation to userModel _id
const paymentSchema = new Schema(
    {
       userId: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        amount: { type: Number, require: true },
        paidon: { type: Date }
    }
);

const paymentModel = mongoose.model("Payment", paymentSchema);

module.exports = paymentModel;   // payment export