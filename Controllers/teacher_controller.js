const express = require("express");
const router = express.Router();
const teacherSchema = require("../models/teacherSchema");
const otpSchema = require("../models/otpSchema");
const nodemailer = require("nodemailer");
require("dotenv").config();

router.post("/verifyOtp", async (req, res) => {
  const { teacheremail, otpnumber } = req.body;

  try {
    const otpData = await otpSchema.findOne({
      teacheremail: teacheremail,
      otpnumber: otpnumber
    });

    res.status(200).json(otpData);
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

    const otp = Math.floor(1000 + Math.random() * 9000);
    console.log(otp);

    try {
      const otpData = new otpSchema({
        otpnumber: otp,
        teacheremail: teacheremail
      });
      await otpData.save();
    } catch (error) {
      res.status(401).json({ message: error.message });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: teacheremail,
      subject: `OTP Verification`,
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px; text-align: center;">
        <div style="max-width: 500px; background: white; padding: 20px; border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 20px;">
          <h2 style="color: #333; font-size: 24px; font-weight: bold;">Your OTP Code</h2>
          <p style="color: #555; font-size: 18px;">Enter this OTP for verification:</p>
          <div style="font-size: 32px; font-weight: bold; color: #007bff; background: #e9f5ff; padding: 10px;
          border-radius: 5px; display: inline-block;">
            ${otp}
          </div>
          <p style="color: #777; font-size: 14px; margin-top: 20px;">This OTP will expire in 10 minutes.</p>
        </div>
      </div>
    `
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json(data);
  } catch (error) {
    console.log("error in login router", error);

    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
