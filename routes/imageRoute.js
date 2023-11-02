const express = require("express");
const multer = require("multer");
const controller = require("../controllers/imageController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const filter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
    console.log(true);
  } else {
    //if u want to throw error if file type doesn'match
    // cb(new Error("file type doesn't match"),false);
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 },
  fileFilter: filter,
});

router
  .route("/image")
  .get(controller.getAllImages)
  .post(upload.single("image"), controller.postImage);

router
  .route("/image/:id")
  .get(controller.getImageById)
  .patch(upload.single("image"), controller.updateImage)
  .delete(controller.deleteImage);

module.exports = router;
