const mongoose = require("mongoose")

const noticeSchema = new mongoose.Schema({
    title: String,
    details: String,
    date: Date,
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
}, { timestamps: true });

module.exports = mongoose.model("notice", noticeSchema)