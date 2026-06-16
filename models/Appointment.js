const mongoose =
require("mongoose");

const appointmentSchema =
new mongoose.Schema(
{
  patientId: {
    type:
      mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  clinicId: {
    type:
      mongoose.Schema.Types.ObjectId,
    ref: "Clinic",
    required: true,
  },

  appointmentDate: {
    type: Date,
    required: true,
  },
  slot: {
  type: String,
  required: true,
},

  note: {
    type: String,
  },

  status: {
    type: String,
    enum: [
      "pending",
      "confirmed",
      "completed",
      "cancelled",
    ],
    default: "pending",
  },
},
{
  timestamps: true,
}
);

module.exports =
mongoose.model(
  "Appointment",
  appointmentSchema
);