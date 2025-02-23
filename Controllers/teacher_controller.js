const express = require("express");
const router = express.Router();
const teacherSchema = require("../models/teacherSchema");
const otpSchema = require("../models/otpSchema");
const nodemailer = require("nodemailer");
require("dotenv").config();

router.post("/verifyOtp", async (req, res) => {
  const { teacheremail, otpnumber } = req.body;

  try {
    const otpData = await otpSchema.find({
      teacheremail: teacheremail,
      otpnumber: otpnumber
    });

    if (otpData) {
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

router.post("/signupTeacher", async (req, res) => {
  try {
    const {
      teachername,
      teacheremail,
      teacherpass,
      teacherimage,
      teacherimageurl
    } = req.body;

    const teacher = await teacherSchema.findOne({ teacheremail });

    if (teacher) {
      return res.status(400).json("teacher already exist");
    }

    const data = new teacherSchema({
      teachername: teachername,
      teacheremail: teacheremail,
      teacherpass: teacherpass,
      teacherimage: teacherimage,
      teacherimageurl: teacherimageurl
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
      teacherpass: teacherpass
    });

    res.status(200).json(data);
  } catch (error) {
    console.log("error in login router", error);

    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
