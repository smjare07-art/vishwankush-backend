const express =
require("express");

const router =
express.Router();

const {
  bookAppointment,
  getAppointments,
  getPendingAppointments,
    updateAppointmentStatus,
} = require(
  "../controllers/appointmentController"
);

router.post(
  "/book",
  bookAppointment
);

router.get(
  "/all",
  getAppointments
);

router.get(
  "/pending-count",
  getPendingAppointments
);
router.put(
  "/status/:id",
  updateAppointmentStatus
);
module.exports =
router;