const express = require("express");
const { getPostsByUserId,deletePostById } = require("../models/post.model");
const postRouter = express.Router();
const { get_saved_posts } = require("../models/post.model");
const authenticateToken = require("../middleware/token.middleware");


postRouter.route('/posts').get(authenticateToken,getPostsByUserId);
postRouter.route('/deletePost/:post_id').delete(authenticateToken,deletePostById ) ;
postRouter.route('/getsavedposts').get(authenticateToken,get_saved_posts)

module.exports =     postRouter

