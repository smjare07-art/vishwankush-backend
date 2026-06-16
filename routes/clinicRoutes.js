const express =
  require("express");

const router =
  express.Router();

const {
  addClinic,
  getClinics,
  deleteClinic,
  updateClinic,
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
router.put(
  "/:id",
  updateClinic
);
module.exports = router;