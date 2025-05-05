'use strict'

const express = require('express');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');
const notificationController = require('../../controllers/notification.controller');
const router = express.Router();

// Here not login

// authentication
router.use(authenticationV2)

router.get('', asyncHandler(notificationController.getListNotifications));


module.exports = router;