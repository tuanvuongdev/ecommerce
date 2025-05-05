const { SuccessResponse } = require("../core/success.response");
const CommentService = require("../services/comment.service");

class CommentController {

    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: "Create new comment success",
            metadata: await CommentService.createComment(req.body),
        }).send(res);
    };

    getCommentsByParentId = async (req, res, next) => {
        new SuccessResponse({
            message: "Get comments success",
            metadata: await CommentService.getCommentsByParentId(req.query),
        }).send(res);
    };

    deleteComments = async (req, res, next) => {
        new SuccessResponse({
            message: "Delete comments success",
            metadata: await CommentService.deleteComments(req.body),
        }).send(res);
    };
}

module.exports = new CommentController();
