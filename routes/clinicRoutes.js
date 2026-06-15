const express =
  require("express");

const router =
  express.Router();

const {
  addClinic,
  getClinics,
} = require(
  "../controllers/clinicController"
);

router.post(
  "/add",
  addClinic
);

router.get(
  "/all",
  getClinics
);

module.exports = router;