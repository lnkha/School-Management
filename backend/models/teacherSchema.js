const mongoose = require("mongoose")

const teacherSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "Teacher" },
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
    teachSubject: { type: mongoose.Schema.Types.ObjectId, ref: 'subject' },
    teachSclass: { type: mongoose.Schema.Types.ObjectId, ref: 'sclass' },
    attendance: [{
        date: Date,
        presentCount: String,
        absentCount: String
    }]
}, { timestamps: true });

module.exports = mongoose.model("teacher", teacherSchema)