"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

// signUp
router.post("/signup", asyncHandler(accessController.signUp));
router.post("/login", asyncHandler(accessController.login));

// authentication
router.use(authenticationV2);

router.post("/logout", asyncHandler(accessController.logout));
router.post(
  "/refresh-token",
  asyncHandler(accessController.handleRefreshTokenV2)
);

module.exports = router;
