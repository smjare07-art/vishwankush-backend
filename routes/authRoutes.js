const express =
  require("express");

const router =
  express.Router();

const {
  sendOTP,
  verifyOTP,
  register,
  login,
  sendForgotOTP,
  verifyForgotOTP,
  resetPassword,

} = require(
  "../controllers/authController"
);

router.post(
  "/send-otp",
  sendOTP
);

router.post(
  "/verify-otp",
  verifyOTP
);

router.post(
  "/register",
  register
);

router.post(
  "/login",
  login
);
router.post(
  "/forgot-password/send-otp",
  sendForgotOTP
);

router.post(
  "/forgot-password/verify-otp",
  verifyForgotOTP
);

router.post(
  "/reset-password",
  resetPassword
);

module.exports = router;