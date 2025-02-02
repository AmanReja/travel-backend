const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    useremail: { type: String, required: true },
    userpass: { type: String, required: true },
    userimage: { type: String }
  },
  { timestamps: true }
);

const user = mongoose.model("User", dataSchema);
module.exports = user;
