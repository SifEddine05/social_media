const express = require("express");
const get_users = require("../models/utilisateur.model");
const { get_saved_posts, add_post, update_post, executeGetRecentPostsFunc } = require("../models/post.model");
const authenticateToken = require("../middleware/token.middleware");
const postRouter = express.Router();

postRouter.route('/getsavedposts').get(authenticateToken,get_saved_posts)
postRouter.route('/addpost').post(authenticateToken,add_post)
postRouter.route('/editpost').put(authenticateToken,update_post)
postRouter.route('/getrecent').get(authenticateToken,executeGetRecentPostsFunc)



module.exports = {
    postRouter
}