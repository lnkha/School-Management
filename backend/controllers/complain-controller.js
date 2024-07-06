const Complain = require('../models/complainSchema.js');

const complainCreate = async (req, res) => {
    const complain = new Complain(req.body);
    res.send(await complain.save());
};

const complainList = async (req, res) => {
    const complains = await Complain.find({ school: req.params.id }).populate("user", "name");
    res.send(complains.length ? complains : { message: "No complains found" });
};

module.exports = { complainCreate, complainList };