const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for admin
const adminSchema = new Schema(
    {
        firstname: { type: String, require: true, max:15 },
        surname: { type: String, require: true, max:15 },
        telephone: { type: Number, unique: true, require: true },
        password: { type: String, require: true, min: 6, max: 15 },
        role: { type: Number, require: true, default: 3 },
        created: { type: Date, default: Date.now }
    }
);

const adminModel = mongoose.model("Admin", adminSchema);

module.exports = adminModel;   // adminModel export