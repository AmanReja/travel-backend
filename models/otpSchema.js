const mongoose = require("mongoose");
const dataSchema = new mongoose.Schema(
  {
    otpnumber: { type: Number },
    teacheremail: { type: String },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600
    }
  },
  { timestamps: true }
);

const otp = mongoose.model("Otp", dataSchema);
module.exports = otp;
