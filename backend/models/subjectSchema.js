const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    subName: String,
    subCode: String,
    sessions: String,
    sclassName: { type: mongoose.Schema.Types.ObjectId, ref: 'sclass' },
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'teacher' },
}, { timestamps: true });

module.exports = mongoose.model("subject", subjectSchema);