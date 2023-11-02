const express = require("express");

const controller = require("../controllers/imageShortingController");

const router = express.Router();

router.route("/shorten/image").post(controller.postShortUrl);

module.exports = router;
