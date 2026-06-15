const Clinic =
  require("../models/Clinic");

exports.addClinic =
  async (req, res) => {
    try {
      const clinic =
        await Clinic.create(
          req.body
        );

      res.status(201).json({
        message:
          "Clinic Added Successfully",
        clinic,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

exports.getClinics =
  async (req, res) => {
    try {
      const clinics =
        await Clinic.find();

      res.json(clinics);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };