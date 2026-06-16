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
  exports.deleteClinic =
  async (req, res) => {
    try {
      await Clinic.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Clinic Deleted Successfully",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };
  exports.updateClinic =
  async (req, res) => {
    try {
      const clinic =
        await Clinic.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );

      res.json({
        message:
          "Clinic Updated Successfully",
        clinic,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };