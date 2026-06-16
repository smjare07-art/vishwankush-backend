const express =
  require("express");

const router =
  express.Router();

const {
  addClinic,
  getClinics,
  deleteClinic,
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
router.delete(
  "/:id",
  deleteClinic
);
module.exports = router;