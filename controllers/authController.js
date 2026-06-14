const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerPatient =
  async (req, res) => {
    try {
      const {
        fullName,
        email,
        phone,
        password,
      } = req.body;

      const existing =
        await User.findOne({
          email,
        });

      if (existing) {
        return res.status(400).json({
          message:
            "User already exists",
        });
      }

      const hashed =
        await bcrypt.hash(
          password,
          10
        );

      const patient =
        await User.create({
          fullName,
          email,
          phone,
          password: hashed,
          role: "patient",
        });

      res.status(201).json({
        message:
          "Patient Registered",
        patient,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

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
      return res.status(400).json({
        message: "User not found",
      });
    }

    const match =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!match) {
      return res.status(400).json({
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
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

    res.json({
      token,
      user: {
        id: user._id,
        fullName:
          user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};