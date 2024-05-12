const express = require("express");
const get_users = require("../models/utilisateur.model");
const { getPostsByUserId,deletePostById } = require("../models/post.model");
const postRouter = express.Router();
const { get_saved_posts } = require("../models/post.model");
const authenticateToken = require("../middleware/token.middleware");


postRouter.route('/posts/:user_id').get(authenticateToken,getPostsByUserId);
postRouter.route('/deletePost/:post_id', deletePostById);
postRouter.route('/getsavedposts').get(authenticateToken,get_saved_posts)

module.exports = {
    postRouter
}
