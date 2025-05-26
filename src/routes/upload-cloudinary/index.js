"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const uploadCloudinaryController = require("../../controllers/upload.cloudinary.controller");
const { uploadDisk } = require("../../configs/multer.config");
const router = express.Router();

router.use(authenticationV2);
router.post("/product", asyncHandler(uploadCloudinaryController.uploadImage));
router.post(
  "/product/thumbnail",
  uploadDisk.single("file"),
  asyncHandler(uploadCloudinaryController.uploadFileThumbnail)
);
router.post(
  "/product/multiple",
  uploadDisk.array("files", 3),
  asyncHandler(uploadCloudinaryController.uploadFileThumbnailMulti)
);

module.exports = router;
