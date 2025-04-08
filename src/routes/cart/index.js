"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const cartController = require("../../controllers/cart.controller");
const router = express.Router();

// get amount discount
router.post("", asyncHandler(cartController.addToCart));
router.delete("", asyncHandler(cartController.delete));
router.post("/update", asyncHandler(cartController.updateCart));
router.get("", asyncHandler(cartController.listToCart));

module.exports = router;
