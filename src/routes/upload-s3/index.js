"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const uploadS3Controller = require("../../controllers/upload.s3.controller");
const { uploadDisk, uploadMemory } = require("../../configs/multer.config");
const router = express.Router();

router.use(authenticationV2);
router.post(
  "/product/bucket",
  uploadMemory.single("file"), // memory has buffer that s3 needed
  asyncHandler(uploadS3Controller.uploadImageFromLocalS3)
);

module.exports = router;
