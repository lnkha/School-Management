const bcrypt = require('bcrypt');
const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');

const studentRegister = async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const existingStudent = await Student.findOne(req.body);
    if (existingStudent) return res.send({ message: 'Roll Number already exists' });
    const student = new Student({ ...req.body, password: hashedPass });
    res.send(await student.save());
};

const studentLogIn = async (req, res) => {
    let student = await Student.findOne(req.body);
    if (!student) return res.send({ message: "Student not found" });
    const validated = await bcrypt.compare(req.body.password, student.password);
    if (!validated) return res.send({ message: "Invalid password" });
    student = await student.populate("school", "schoolName").populate("sclassName", "sclassName");
    res.send(student);
};

const getStudents = async (req, res) => {
    const students = await Student.find({ school: req.params.id }).populate("sclassName", "sclassName");
    res.send(students.length ? students : { message: "No students found" });
};

const getStudentDetail = async (req, res) => {
    const student = await Student.findById(req.params.id)
        .populate("school", "schoolName")
        .populate("sclassName", "sclassName")
        .populate("examResult.subName", "subName")
        .populate("attendance.subName", "subName sessions");
    res.send(student || { message: "No student found" });
}

const deleteStudent = async (req, res) => {
    res.send(await Student.findByIdAndDelete(req.params.id));
}

const deleteStudents = async (req, res) => {
    const result = await Student.deleteMany({ school: req.params.id });
    res.send(result.deletedCount ? result : { message: "No students found to delete" });
}

const deleteStudentsByClass = async (req, res) => {
    const result = await Student.deleteMany({ sclassName: req.params.id });
    res.send(result.deletedCount ? result : { message: "No students found to delete" });
}

const updateStudent = async (req, res) => {
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    res.send(await Student.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }));
}

const updateExamResult = async (req, res) => {
    const student = await Student.findById(req.params.id);
    if (!student) return res.send({ message: 'Student not found' });
    const existingResult = student.examResult.find(result => result.subName.toString() === req.body.subName);
    if (existingResult) existingResult.marksObtained = req.body.marksObtained;
    else student.examResult.push(req.body);
    res.send(await student.save());
};

const studentAttendance = async (req, res) => {
    const student = await Student.findById(req.params.id);
    if (!student) return res.send({ message: 'Student not found' });
    const existingAttendance = student.attendance.find(a => a.date.toDateString() === new Date(req.body.date).toDateString() && a.subName.toString() === req.body.subName);
    if (existingAttendance) existingAttendance.status = req.body.status;
    else student.attendance.push(req.body);
    res.send(await student.save());
};

const clearAllStudentsAttendanceBySubject = async (req, res) => {
    res.send(await Student.updateMany({ 'attendance.subName': req.params.id }, { $pull: { attendance: { subName: req.params.id } } }));
};

const clearAllStudentsAttendance = async (req, res) => {
    res.send(await Student.updateMany({ school: req.params.id }, { $set: { attendance: [] } }));
};

const removeStudentAttendanceBySubject = async (req, res) => {
    res.send(await Student.updateOne({ _id: req.params.id }, { $pull: { attendance: { subName: req.body.subId } } }));
};

const removeStudentAttendance = async (req, res) => {
    res.send(await Student.updateOne({ _id: req.params.id }, { $set: { attendance: [] } }));
};

module.exports = {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudents,
    deleteStudent,
    updateStudent,
    studentAttendance,
    deleteStudentsByClass,
    updateExamResult,
    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance,
};