"use strict";

const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const { pushToLogDiscord } = require("../middlewares");
const sanitizeMiddleware = require("../middlewares/sanitize.middleware");
const { asyncHandler } = require("../helpers/asyncHandler");
const router = express.Router();

router.use(sanitizeMiddleware);
// add log to discord
router.use(pushToLogDiscord);
// check apiKey
router.use(apiKey);
// check permission
router.use(permission("0000"));

router.use("/v1/api/comment", require("./comment"));
router.use("/v1/api/notification", require("./notification"));
router.use("/v1/api/checkout", require("./checkout"));
router.use("/v1/api/inventory", require("./inventory"));
router.use("/v1/api/upload-cloudinary", require("./upload-cloudinary"));
router.use("/v1/api/upload-s3", require("./upload-s3"));
router.use("/v1/api/discount", require("./discount"));
router.use("/v1/api/cart", require("./cart"));
router.use("/v1/api/product", require("./product"));
router.use("/v1/api/shop", require("./access"));

module.exports = router;
