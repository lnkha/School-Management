const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: String,
    rollNum: Number,
    password: String,
    sclassName: { type: mongoose.Schema.Types.ObjectId, ref: 'sclass' },
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
    role: { type: String, default: "Student" },
    examResult: [
        {
            subName: { type: mongoose.Schema.Types.ObjectId, ref: 'subject' },
            marksObtained: { type: Number, default: 0 }
        }
    ],
    attendance: [{
        date: Date,
        status: { type: String, enum: ['Present', 'Absent'] },
        subName: { type: mongoose.Schema.Types.ObjectId, ref: 'subject' }
    }]
});

module.exports = mongoose.model("student", studentSchema);