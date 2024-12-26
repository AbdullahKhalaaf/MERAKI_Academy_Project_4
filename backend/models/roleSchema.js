const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  role: { type: String, unique: true },
  permissions: [{ type: String, require: true }],
});

const roleModel = mongoose.model("Role", roleSchema);
module.exports = roleModel;
