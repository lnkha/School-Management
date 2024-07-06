const Notice = require('../models/noticeSchema.js');

const noticeCreate = async (req, res) => {
    const notice = new Notice(req.body);
    res.send(await notice.save());
};

const noticeList = async (req, res) => {
    const notices = await Notice.find({ school: req.params.id });
    res.send(notices.length ? notices : { message: "No notices found" });
};

const updateNotice = async (req, res) => {
    res.send(await Notice.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }));
}

const deleteNotice = async (req, res) => {
    res.send(await Notice.findByIdAndDelete(req.params.id));
}

const deleteNotices = async (req, res) => {
    const result = await Notice.deleteMany({ school: req.params.id });
    res.send(result.deletedCount ? result : { message: "No notices found to delete" });
}

module.exports = { noticeCreate, noticeList, updateNotice, deleteNotice, deleteNotices };