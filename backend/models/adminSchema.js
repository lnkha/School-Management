const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "Admin" },
    schoolName: { type: String, unique: true }
});

module.exports = mongoose.model("admin", adminSchema)