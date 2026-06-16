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