const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudnary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "healthcare-project",
    resource_type: "auto",
    public_id: `${Date.now()}-${file.originalname.split(".")[0]}`
  })
});

const upload = multer({ storage });

module.exports = upload;