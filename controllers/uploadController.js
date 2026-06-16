const cloudinary =
  require("../config/cloudinary");

exports.uploadImage =
  async (req, res) => {
    try {

      const result =
        await cloudinary.uploader.upload(
          req.file.path,
          {
            folder:
              "vishwankush-doctors",
          }
        );

      res.json({
        imageUrl:
          result.secure_url,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };