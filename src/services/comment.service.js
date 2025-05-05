'use strict'

const { NotFoundError } = require('../core/error.response');
const Comment = require('../models/comment.model');
const { findProduct } = require('../models/repositories/product.repo');

/*
    Key features: Comment Service
    + add comment [User, Shop]
    + get list of comments [User, Shop]
    + delete comment [User | Shop | Admin]
*/
class CommentService {

    static async createComment({
        productId, userId, content, parentCommentId = null
    }) {
        const comment = new Comment({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        })

        let rightValue
        if (parentCommentId) {
            // reply comment
            const parentComment = await Comment.findById(parentCommentId)
            if (!parentComment) throw new NotFoundError('Parent comment not found')

            rightValue = parentComment.comment_right
            // updateMany commnets

            await Comment.updateMany({
                comment_productId: productId,
                comment_right: { $gte: parentComment.comment_right }
            }, {
                $inc: {
                    comment_right: 2
                }
            })

            await Comment.updateMany({
                comment_productId: productId,
                comment_left: { $gt: parentComment.comment_right }
            }, {
                $inc: {
                    comment_left: 2
                }
            })
        } else {
            const maxRightValue = await Comment.findOne({
                comment_productId: productId
            }).sort({ comment_right: -1 })
            if (maxRightValue) {
                rightValue = maxRightValue.comment_right + 1
            } else {
                rightValue = 1
            }
        }

        // insert comment
        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1

        await comment.save()
        return comment
    }

    static async getCommentsByParentId({
        productId, parentCommentId = null, limit = 50, offset = 0 // skip
    }) {
        if (parentCommentId) {
            const parent = await Comment.findById(parentCommentId)
            if (!parent) throw new NotFoundError('Parent comment not found')

            const comments = await Comment.find({
                comment_productId: productId,
                comment_left: { $gt: parent.comment_left },
                comment_right: { $lt: parent.comment_right },
            }).select({
                comment_content: 1,
                comment_left: 1,
                comment_right: 1,
                comment_parentId: 1
            }).sort({ comment_left: 1 }).limit(limit).skip(offset).lean()
            return comments
        }

        const comments = await Comment.find({
            comment_productId: productId,
            comment_parentId: parentCommentId,
        }).select({
            comment_content: 1,
            comment_left: 1,
            comment_right: 1,
            comment_parentId: 1
        }).sort({ comment_left: 1 }).limit(limit).skip(offset).lean()
        return comments
    }

    static async deleteComments({
        commentId, productId
    }) {
        // check the product existed in db
        const foundProduct = await findProduct({ product_id: productId })
        if (!foundProduct) throw new NotFoundError('Product not found')

        // Xac dinh gia tri left right of commentId
        const comment = await Comment.findById(commentId)
        if (!comment) throw new NotFoundError('Comment not found')

        const leftValue = comment.comment_left
        const rightValue = comment.comment_right

        // Tinh width
        const width = rightValue - leftValue + 1

        // delete comments
        await Comment.deleteMany({
            comment_productId: productId,
            comment_left: { $gte: leftValue },
            comment_right: { $lte: rightValue }
        })

        // cap nhat cac left va right cua comment con lai
        await Comment.updateMany({
            comment_productId: productId,
            comment_right: { $gt: rightValue }
        }, {
            $inc: {
                comment_right: -width
            }
        })

        await Comment.updateMany({
            comment_productId: productId,
            comment_left: { $gt: rightValue }
        }, {
            $inc: {
                comment_left: -width
            }
        })
    }
}

module.exports = CommentService