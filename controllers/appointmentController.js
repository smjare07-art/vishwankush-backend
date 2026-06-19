const Appointment =
require("../models/Appointment");

/* =====================
BOOK APPOINTMENT
===================== */



exports.bookAppointment =
async (req, res) => {

  try {

    const {
      patientId,
      clinicId,
      appointmentDate,
      slot,
      note,
    } = req.body;

    const appointment =
      await Appointment.create({
        patientId,
        clinicId,
        appointmentDate,
        slot,
        note,
      });

    res.status(201).json({
      message:
        "Appointment Booked Successfully",
      appointment,
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }

};

/* =====================
DOCTOR APPOINTMENTS
===================== */
exports.getAppointments =
async (req, res) => {

  try {

    const appointments =
      await Appointment.find()
        .populate(
          "patientId",
          "fullName email mobile"
        )
        .populate(
          "clinicId",
          "clinicName city address"
        )
        .sort({
          appointmentDate: 1,
        });

    res.json(
      appointments
    );

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }

};
exports.getPendingAppointments =
async (req, res) => {

  try {

    const count =
      await Appointment.countDocuments({
        status: "pending",
      });

    res.json({
      count,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};
exports.updateAppointmentStatus =
async (req, res) => {

  try {

    const { id } =
      req.params;

    const { status } =
      req.body;

    const appointment =
      await Appointment.findByIdAndUpdate(
        id,
        {
          status,
        },
        {
          new: true,
        }
      );

    res.json(
      appointment
    );

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }

};