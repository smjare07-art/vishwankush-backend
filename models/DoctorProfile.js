const mongoose = require("mongoose");

const doctorProfileSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      fullName: String,

      profilePhoto: String,

      coverPhoto: String,

      gender: String,

      mobile: String,

      email: String,

      qualification: String,

      specialization: String,

      experienceYears: String,

      registrationNumber: String,

      medicalCouncil: String,

      aboutDoctor: String,

      expertise: [String],

      servicesOffered: [String],

      awards: [String],

      certifications: [String],

      website: String,

      instagram: String,

      facebook: String,

      youtube: String,

      linkedin: String,
      
    },
    
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "DoctorProfile",
    doctorProfileSchema
  );