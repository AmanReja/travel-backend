const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    teachername: {
      type: String,
      required: true,
    },
    teacheremail: {
      type: String,
      required: true,
    },
    teacherpass: {
      type: String,
      required: true,
    },
    teacherimage: {
      type: String,
    },
    teacherimageurl: {
      type: String,
    },
  },
  { timestamps: true }
);

const teacher = mongoose.model("Teacher", dataSchema);
module.exports = teacher;
