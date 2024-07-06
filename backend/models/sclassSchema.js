const mongoose = require("mongoose");

const sclassSchema = new mongoose.Schema({
    sclassName: String,
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
}, { timestamps: true });

module.exports = mongoose.model("sclass", sclassSchema);