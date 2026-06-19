const User = require("../models/User");
const OTP = require("../models/OTP");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

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
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({
          message: "Email Required",
        });
    }

    const otp =
      Math.floor(
        1000 +
          Math.random() * 9000
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

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name:
            "Shri Vishwankush Ayurvedic Clinic",
          email:
            "shrivishwankushayurvedicclinic@gmail.com",
        },

        to: [
          {
            email,
          },
        ],

        subject:
          "Email Verification OTP",

        htmlContent: `
<!DOCTYPE html>
<html>
<body style="font-family:Arial;background:#F8F5EC;padding:20px">

<div style="
max-width:600px;
margin:auto;
background:#fff;
border-radius:15px;
padding:30px;
text-align:center;
">

<h2 style="color:#8B0000">
श्री विश्वांकुश आयुर्वेदीय क्लिनिक
</h2>

<p>
Ayurveda Rooted Healing With Modern Care
</p>

<div style="
padding:20px;
margin-top:20px;
border:2px dashed #2E7D32;
border-radius:12px;
">

<p>Your Verification OTP</p>

<h1 style="
font-size:40px;
color:#2E7D32;
letter-spacing:8px;
">
${otp}
</h1>

</div>

<p>
OTP is valid for
<b>5 Minutes</b>
</p>

</div>

</body>
</html>
`,
      },
      {
        headers: {
          "api-key":
            process.env
              .BREVO_API_KEY,

          "Content-Type":
            "application/json",
        },
      }
    );

    return res.json({
      message:
        "OTP Sent Successfully",
    });
  } catch (error) {
    console.log(
      error.response?.data ||
        error.message
    );

    return res
      .status(500)
      .json({
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
      return res.status(400).json({
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
        isEmailVerified: true,
        profileCompleted: false,
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
        role:
          user.role,
        profileCompleted:
          user.profileCompleted,
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
  message: "Login Successful",
  token,

  user: {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    profileCompleted:
      user.profileCompleted,
  },
});
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};
exports.sendForgotOTP =
  async (req, res) => {
    try {
      const { email } =
        req.body;

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
          300000,
      });

      await axios.post(
  "https://api.brevo.com/v3/smtp/email",
  {
    sender: {
      name:
        "Shri Vishwankush Ayurvedic Clinic",
      email:
        "shrivishwankushayurvedicclinic@gmail.com",
    },

    to: [
      {
        email,
      },
    ],

    subject:
      "Password Reset OTP",

    htmlContent: `
<!DOCTYPE html>
<html>
<body style="font-family:Arial;background:#F8F5EC;padding:20px">

<div style="
max-width:600px;
margin:auto;
background:#fff;
border-radius:15px;
padding:30px;
text-align:center;
">

<h2 style="color:#8B0000">
श्री विश्वांकुश आयुर्वेदीय क्लिनिक
</h2>

<p>
Password Reset Verification
</p>

<div style="
padding:20px;
margin-top:20px;
border:2px dashed #2E7D32;
border-radius:12px;
">

<p>Your Reset OTP</p>

<h1 style="
font-size:40px;
color:#2E7D32;
letter-spacing:8px;
">
${otp}
</h1>

</div>

<p>
OTP is valid for
<b>5 Minutes</b>
</p>

</div>

</body>
</html>
`,
  },
  {
    headers: {
      "api-key":
        process.env.BREVO_API_KEY,

      "Content-Type":
        "application/json",
    },
  }
);

      res.json({
        message:
          "OTP Sent Successfully",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };
  exports.verifyForgotOTP =
  async (req, res) => {
    try {
      const {
        email,
        otp,
      } = req.body;

      const record =
        await OTP.findOne({
          email,
          otp,
        });

      if (!record) {
        return res
          .status(400)
          .json({
            message:
              "Invalid OTP",
          });
      }

      res.json({
        message:
          "OTP Verified",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };
exports.resetPassword =
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      const hashed =
        await bcrypt.hash(
          password,
          10
        );

      await User.findOneAndUpdate(
        { email },
        {
          password:
            hashed,
        }
      );

      await OTP.deleteMany({
        email,
      });

      res.json({
        message:
          "Password Changed Successfully",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };
