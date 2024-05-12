const express = require("express");
const {likeComment, dislikeComment} = require("../models/comment.model");
const CommentRouter = express.Router();

CommentRouter.route('/comment/like/').post(likeComment)
CommentRouter.route('/comment/dislike/').post(dislikeComment)

module.exports = CommentRouter ;