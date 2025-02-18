const express = require("express");
const router = express.Router();
const teacherSchema = require("../models/teacherSchema");

router.post("/signupTeacher", async (req, res) => {
  try {
    const {
      teachername,
      teacheremail,
      teacherpass,
      teacherimage,
      teacherimageurl,
    } = req.body;
    const teacher = await teacherSchema.findOne({ teacheremail });

    if (teacher) {
      res.status(400).json("teacher already exist");
    }

    const data = new teacherSchema({
      teachername: teachername,
      teacheremail: teacheremail,
      teacherpass: teacherpass,
      teacherimage: teacherimage,
      teacherimageurl: teacherimageurl,
    });

    const saveData = await data.save();
    res.status(200).json(saveData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/loginTeacher", async (req, res) => {
  const { teacheremail, teacherpass } = req.body;
  try {
    const data = await teacherSchema.find({
      teacheremail: teacheremail,
      teacherpass: teacherpass,
    });
    res.status(200).json(data);
  } catch (error) {
    console.log("error in login router", error);

    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
