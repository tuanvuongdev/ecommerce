'use strict'

const express = require('express');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');
const commentController = require('../../controllers/comment.controller');
const router = express.Router();

// authentication
router.use(authenticationV2)

router.post('', asyncHandler(commentController.createComment));
router.get('', asyncHandler(commentController.getCommentsByParentId));
router.delete('', asyncHandler(commentController.deleteComments));


module.exports = router;