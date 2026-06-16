const express =
  require("express");

const router =
  express.Router();

const {
  getProfile,
  updateProfile,
    createDefaultProfileAPI,
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
router.get(
  "/create-default",
  createDefaultProfileAPI
);
module.exports = router;