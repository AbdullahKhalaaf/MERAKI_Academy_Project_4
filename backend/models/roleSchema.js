const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  role: { type: String, unique: true },
  permissions: [{ type: String, require: true }],
});

module.exports = mongoose.model("Role", roleSchema);
