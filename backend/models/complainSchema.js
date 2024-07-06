const mongoose = require('mongoose');

const complainSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'student', required: true },
    date: Date,
    complaint: String,
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'admin', required: true },
});

module.exports = mongoose.model("complain", complainSchema);