const bcrypt = require('bcrypt');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');

const teacherRegister = async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const teacher = new Teacher({ ...req.body, password: hashedPass });
    if (await Teacher.findOne({ email: req.body.email })) return res.send({ message: 'Email already exists' });
    await Subject.findByIdAndUpdate(req.body.teachSubject, { teacher: teacher._id });
    res.send(await teacher.save());
};

const teacherLogIn = async (req, res) => {
    const teacher = await Teacher.findOne({ email: req.body.email });
    if (!teacher) return res.send({ message: "Teacher not found" });
    if (!await bcrypt.compare(req.body.password, teacher.password)) return res.send({ message: "Invalid password" });
    res.send(await teacher.populate("teachSubject", "subName sessions").populate("school", "schoolName").populate("teachSclass", "sclassName"));
};

const getTeachers = async (req, res) => {
    const teachers = await Teacher.find({ school: req.params.id }).populate("teachSubject", "subName").populate("teachSclass", "sclassName");
    res.send(teachers.length ? teachers : { message: "No teachers found" });
};

const getTeacherDetail = async (req, res) => {
    const teacher = await Teacher.findById(req.params.id).populate("teachSubject", "subName sessions").populate("school", "schoolName").populate("teachSclass", "sclassName");
    res.send(teacher || { message: "No teacher found" });
}

const updateTeacherSubject = async (req, res) => {
    const updatedTeacher = await Teacher.findByIdAndUpdate(req.body.teacherId, { teachSubject: req.body.teachSubject }, { new: true });
    await Subject.findByIdAndUpdate(req.body.teachSubject, { teacher: updatedTeacher._id });
    res.send(updatedTeacher);
};

const deleteTeacher = async (req, res) => {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
    await Subject.updateOne({ teacher: deletedTeacher._id }, { $unset: { teacher: 1 } });
    res.send(deletedTeacher);
};

const deleteTeachers = async (req, res) => {
    const deletionResult = await Teacher.deleteMany({ school: req.params.id });
    const deletedTeachers = await Teacher.find({ school: req.params.id });
    await Subject.updateMany({ teacher: { $in: deletedTeachers.map(teacher => teacher._id) } }, { $unset: { teacher: "" } });
    res.send(deletionResult);
};

const deleteTeachersByClass = async (req, res) => {
    const deletionResult = await Teacher.deleteMany({ sclassName: req.params.id });
    const deletedTeachers = await Teacher.find({ sclassName: req.params.id });
    await Subject.updateMany({ teacher: { $in: deletedTeachers.map(teacher => teacher._id) } }, { $unset: { teacher: "" } });
    res.send(deletionResult);
};

const teacherAttendance = async (req, res) => {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.send({ message: 'Teacher not found' });
    const existingAttendance = teacher.attendance.find(a => a.date.toDateString() === new Date(req.body.date).toDateString());
    if (existingAttendance) existingAttendance.status = req.body.status;
    else teacher.attendance.push(req.body);
    res.send(await teacher.save());
};

module.exports = {
    teacherRegister,
    teacherLogIn,
    getTeachers,
    getTeacherDetail,
    updateTeacherSubject,
    deleteTeacher,
    deleteTeachers,
    deleteTeachersByClass,
    teacherAttendance
};