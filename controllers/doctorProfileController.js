const DoctorProfile =
  require("../models/DoctorProfile");

exports.createDefaultProfile =
  async () => {

    const exists =
      await DoctorProfile.findOne({
        email:
          "shrivishwankushayurvedicclinic@gmail.com",
      });

    if (exists) return;

    await DoctorProfile.create({
      fullName:
        "Dr. Vishwankush",

      profilePhoto:
        "https://i.pravatar.cc/300",

      gender: "Male",

      mobile:
        "9999999999",

      email:
        "shrivishwankushayurvedicclinic@gmail.com",

      qualification:
        "BAMS",

      specialization:
        "Ayurvedic Physician",

      experienceYears:
        "12",

      registrationNumber:
        "AYU-2026-001",

      medicalCouncil:
        "Maharashtra Medical Council",

      aboutDoctor:
        "Experienced Ayurvedic doctor dedicated to holistic healing and preventive healthcare.",

      expertise: [
        "Panchakarma",
        "Skin Disorders",
        "Joint Pain",
      ],

      servicesOffered: [
        "Consultation",
        "Panchakarma",
        "Diet Planning",
      ],

      awards: [
        "Best Ayurvedic Doctor 2024",
      ],

      certifications: [
        "Panchakarma Specialist",
      ],

      website:
        "https://vishwankush.com",

      instagram:
        "https://instagram.com/vishwankush",

      facebook:
        "https://facebook.com/vishwankush",
    });
  };
  exports.getProfile =
  async (req, res) => {

    const profile =
      await DoctorProfile.findOne({
        email:
          "shrivishwankushayurvedicclinic@gmail.com",
      });

    res.json(profile);
  };
  exports.updateProfile =
  async (req, res) => {
    try {
      const profile =
        await DoctorProfile.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      res.json({
        message:
          "Profile Updated Successfully",
        profile,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };