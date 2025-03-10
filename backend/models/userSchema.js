const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  userName: { type: String },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  avatar: {
    type: String,
    default:
      "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png",
  },
  
});
userSchema.pre("save", async function () {
  this.email = this.email.toLowerCase();

  const salt = 10;
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
});



const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
