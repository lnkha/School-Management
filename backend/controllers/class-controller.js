const Sclass = require('../models/sclassSchema.js');
const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');
const Teacher = require('../models/teacherSchema.js');

const sclassCreate = async (req, res) => {
    const sclass = new Sclass(req.body);
    const existingSclass = await Sclass.findOne(req.body);
    if (existingSclass) return res.send({ message: 'Class already exists' });
    res.send(await sclass.save());
};

const sclassList = async (req, res) => {
    const sclasses = await Sclass.find({ school: req.params.id });
    res.send(sclasses.length ? sclasses : { message: "No classes found" });
};

const getSclassDetail = async (req, res) => {
    const sclass = await Sclass.findById(req.params.id).populate("school", "schoolName");
    res.send(sclass || { message: "No class found" });
}

const getSclassStudents = async (req, res) => {
    const students = await Student.find({ sclassName: req.params.id });
    res.send(students.length ? students : { message: "No students found" });
}

const deleteSclass = async (req, res) => {
    const deletedClass = await Sclass.findByIdAndDelete(req.params.id);
    if (!deletedClass) return res.send({ message: "Class not found" });
    await Student.deleteMany({ sclassName: req.params.id });
    await Subject.deleteMany({ sclassName: req.params.id });
    await Teacher.deleteMany({ teachSclass: req.params.id });
    res.send(deletedClass);
}

const deleteSclasses = async (req, res) => {
    const deletedClasses = await Sclass.deleteMany({ school: req.params.id });
    if (!deletedClasses.deletedCount) return res.send({ message: "No classes found to delete" });
    await Student.deleteMany({ school: req.params.id });
    await Subject.deleteMany({ school: req.params.id });
    await Teacher.deleteMany({ school: req.params.id });
    res.send(deletedClasses);
}

module.exports = { sclassCreate, sclassList, deleteSclass, deleteSclasses, getSclassDetail, getSclassStudents };