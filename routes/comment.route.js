const express = require("express");
const {likeComment, dislikeComment, replyComment, updateComment, deleteComment} = require("../models/comment.model");
const authenticateToken = require("../middleware/token.middleware");
const CommentRouter = express.Router();

CommentRouter.route('/comment/like/').post(likeComment)
CommentRouter.route('/comment/dislike/').post(dislikeComment)
CommentRouter.route('/comment/reply').post(authenticateToken,replyComment)
CommentRouter.route('/comment/update').put(authenticateToken,updateComment)
CommentRouter.route('/comment/:commentId').delete(authenticateToken,deleteComment)

module.exports = CommentRouter ;