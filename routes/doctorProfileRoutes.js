const express =
  require("express");

const router =
  express.Router();

const {
  getProfile,
  updateProfile,
} = require(
  "../controllers/doctorProfileController"
);

router.get(
  "/profile",
  getProfile
);

router.put(
  "/profile/:id",
  updateProfile
);

module.exports = router;