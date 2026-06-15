const User = require("../models/User");
const OTP = require("../models/OTP");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const transporter = require("../utils/sendEmail");

/* ==========================
   CREATE DEFAULT DOCTOR
========================== */

const createDoctorIfNotExists =
  async () => {
    try {
      const doctor =
        await User.findOne({
          email:
            "shrivishwankushayurvedicclinic@gmail.com",
        });

      if (!doctor) {
        const hashedPassword =
          await bcrypt.hash(
            "123456",
            10
          );

        await User.create({
          fullName:
            "Dr. Vishwankush",
          mobile:
            "9999999999",
          email:
            "shrivishwankushayurvedicclinic@gmail.com",
          password:
            hashedPassword,
          role: "doctor",
          isEmailVerified: true,
        });

        console.log(
          "Default Doctor Created"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

createDoctorIfNotExists();

/* ==========================
   SEND OTP
========================== */

exports.sendOTP = async (
  req,
  res
) => {
  try {
    const { email } =
      req.body;

    if (!email) {
      return res
        .status(400)
        .json({
          message:
            "Email Required",
        });
    }

    const otp =
      Math.floor(
        1000 +
          Math.random() *
            9000
      ).toString();

    await OTP.deleteMany({
      email,
    });

    await OTP.create({
      email,
      otp,
      expiresAt:
        Date.now() +
        5 * 60 * 1000,
    });

    await transporter.sendMail({
      from:
        process.env.BREVO_USER,

      to: email,

      subject:
        "Email Verification OTP",

      html: `
        <h2>Shri Vishwankush Ayurvedic Clinic</h2>
        <h3>Your OTP : ${otp}</h3>
        <p>Valid for 5 Minutes</p>
      `,
    });

    res.json({
      message:
        "OTP Sent Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        "Failed To Send OTP",
    });
  }
};

/* ==========================
   VERIFY OTP
========================== */

exports.verifyOTP =
  async (req, res) => {
    try {
      const {
        email,
        otp,
      } = req.body;

      const otpRecord =
        await OTP.findOne({
          email,
          otp,
        });

      if (!otpRecord) {
        return res
          .status(400)
          .json({
            message:
              "Invalid OTP",
          });
      }

      if (
        otpRecord.expiresAt <
        new Date()
      ) {
        return res
          .status(400)
          .json({
            message:
              "OTP Expired",
          });
      }

      await OTP.deleteMany({
        email,
      });

      res.json({
        message:
          "Email Verified Successfully",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

/* ==========================
   REGISTER PATIENT
========================== */

exports.register =
  async (req, res) => {
    try {
      const {
        fullName,
        mobile,
        email,
        password,
      } = req.body;

      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {
        return res
          .status(400)
          .json({
            message:
              "User Already Exists",
          });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const user =
        await User.create({
          fullName,
          mobile,
          email,
          password:
            hashedPassword,
          role: "patient",
          isEmailVerified:
            true,
        });

      res.status(201).json({
        message:
          "Registration Successful",

        user: {
          id: user._id,
          fullName:
            user.fullName,
          email:
            user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

/* ==========================
   LOGIN
========================== */

exports.login = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      return res
        .status(400)
        .json({
          message:
            "User Not Found",
        });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res
        .status(400)
        .json({
          message:
            "Invalid Credentials",
        });
    }

    const token =
      jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env
          .JWT_SECRET,
        {
          expiresIn:
            "7d",
        }
      );

    res.json({
      message:
        "Login Successful",

      token,

      user: {
        id: user._id,
        fullName:
          user.fullName,
        email:
          user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};