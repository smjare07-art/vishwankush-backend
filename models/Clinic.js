const mongoose = require("mongoose");

const clinicSchema =
  new mongoose.Schema(
    {
      clinicName: String,
      branchName: String,
      address: String,
      city: String,
      mapLink: String,

      visitType: {
        type: String,
        enum: [
          "regular",
          "monthly",
        ],
      },

      availableDays: [String],

      weekNumber: String,

      day: String,

      openingTime: String,

      closingTime: String,

      slotDuration: String,
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Clinic",
    clinicSchema
  );