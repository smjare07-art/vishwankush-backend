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
await transporter.verify();

console.log(
  "SMTP Connected Successfully"
);
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
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>

<body style="
margin:0;
padding:0;
background:#F8F5EC;
font-family:Arial,sans-serif;
">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table
width="600"
style="
background:#ffffff;
margin-top:20px;
border-radius:20px;
overflow:hidden;
box-shadow:0 4px 20px rgba(0,0,0,0.08);
"
>

<tr>
<td
style="
background:#2E7D32;
padding:25px;
text-align:center;
"
>

<img
src="https://YOUR_LOGO_LINK_HERE"
width="90"
/>

<h1
style="
color:white;
margin-top:10px;
font-size:24px;
"
>
श्री विश्वांकुश आयुर्वेदीय क्लिनिक
</h1>

</td>
</tr>

<tr>
<td style="padding:40px">

<h2
style="
color:#8B0000;
text-align:center;
margin-bottom:10px;
"
>
Email Verification
</h2>

<p
style="
text-align:center;
color:#555;
font-size:15px;
"
>
Ayurveda Rooted Healing With Modern Care
</p>

<div
style="
background:#F8F5EC;
border:2px dashed #2E7D32;
border-radius:15px;
padding:25px;
margin-top:25px;
text-align:center;
"
>

<p
style="
font-size:16px;
color:#444;
margin-bottom:10px;
"
>
Your Verification OTP
</p>

<h1
style="
font-size:42px;
letter-spacing:10px;
color:#2E7D32;
margin:0;
"
>
${otp}
</h1>

</div>

<p
style="
text-align:center;
margin-top:20px;
color:#777;
"
>
OTP is valid for
<b>5 Minutes</b>
</p>

<p
style="
margin-top:30px;
color:#555;
font-size:14px;
"
>
If you did not request this OTP,
please ignore this email.
</p>

</td>
</tr>

<tr>
<td
style="
background:#F8F5EC;
padding:20px;
text-align:center;
font-size:13px;
color:#777;
"
>
Powered By Vishwankush Healthcare
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
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