const express =
require("express");

const router =
express.Router();

const {
  bookAppointment,
  getAppointments,
} = require(
  "../controllers/appointmentController"
);

router.post(
  "/book",
  bookAppointment
);

router.get(
  "/pending-count",
  appointmentController.getPendingAppointments
);

module.exports =
router;