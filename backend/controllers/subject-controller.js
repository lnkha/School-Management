const Subject = require('../models/subjectSchema.js');
const Teacher = require('../models/teacherSchema.js');
const Student = require('../models/studentSchema.js');

const subjectCreate = async (req, res) => {
    const existingSubject = await Subject.findOne(req.body);
    if (existingSubject) return res.send({ message: 'Subcode already exists' });
    const newSubjects = req.body.subjects.map(subject => new Subject({ ...subject, sclassName: req.body.sclassName, school: req.body.adminID }));
    res.send(await Subject.insertMany(newSubjects));
};

const allSubjects = async (req, res) => {
    const subjects = await Subject.find({ school: req.params.id }).populate("sclassName", "sclassName");
    res.send(subjects.length ? subjects : { message: "No subjects found" });
};

const classSubjects = async (req, res) => {
    const subjects = await Subject.find({ sclassName: req.params.id });
    res.send(subjects.length ? subjects : { message: "No subjects found" });
};

const freeSubjectList = async (req, res) => {
    const subjects = await Subject.find({ sclassName: req.params.id, teacher: { $exists: false } });
    res.send(subjects.length ? subjects : { message: "No subjects found" });
};

const getSubjectDetail = async (req, res) => {
    const subject = await Subject.findById(req.params.id).populate("sclassName", "sclassName").populate("teacher", "name");
    res.send(subject || { message: "No subject found" });
}

const deleteSubject = async (req, res) => {
    const deletedSubject = await Subject.findByIdAndDelete(req.params.id);
    await Teacher.updateOne({ teachSubject: deletedSubject._id }, { $unset: { teachSubject: "" } });
    await Student.updateMany({}, { $pull: { examResult: { subName: deletedSubject._id }, attendance: { subName: deletedSubject._id } } });
    res.send(deletedSubject);
};

const deleteSubjects = async (req, res) => {
    const deletedSubjects = await Subject.deleteMany({ school: req.params.id });
    await Teacher.updateMany({ teachSubject: { $in: deletedSubjects.map(subject => subject._id) } }, { $unset: { teachSubject: "" } });
    await Student.updateMany({}, { $set: { examResult: null, attendance: null } });
    res.send(deletedSubjects);
};

const deleteSubjectsByClass = async (req, res) => {
    const deletedSubjects = await Subject.deleteMany({ sclassName: req.params.id });
    await Teacher.updateMany({ teachSubject: { $in: deletedSubjects.map(subject => subject._id) } }, { $unset: { teachSubject: "" } });
    await Student.updateMany({}, { $set: { examResult: null, attendance: null } });
    res.send(deletedSubjects);
};

module.exports = { subjectCreate, freeSubjectList, classSubjects, getSubjectDetail, deleteSubjectsByClass, deleteSubjects, deleteSubject, allSubjects };