const express = require("express");
const get_users = require("../models/utilisateur.model");
const { get_saved_posts, add_post, update_post, executeGetRecentPostsFunc, getpostcomments, getPostsByUserId, deletePostById, getmyposts, likePost, savePost, commentPost, searchAccount } = require("../models/post.model");
const authenticateToken = require("../middleware/token.middleware");
const postRouter = express.Router();

postRouter.route('/getsavedposts').get(authenticateToken,get_saved_posts)
postRouter.route('/addpost').post(authenticateToken,add_post)
postRouter.route('/editpost').put(authenticateToken,update_post)
postRouter.route('/getrecent').get(authenticateToken,executeGetRecentPostsFunc)
postRouter.route('/getpostcomments').get(authenticateToken,getpostcomments)
postRouter.route('/getmyposts').get(authenticateToken,getmyposts)
postRouter.route('/postsbyuser/:user_id').get(authenticateToken, getPostsByUserId);
postRouter.route('/deletepost/:post_id').delete(authenticateToken, deletePostById);
postRouter.route('/likepost').post(authenticateToken, likePost);
postRouter.route('/savepost').post(authenticateToken, savePost);
postRouter.route('/commentpost').post(authenticateToken, commentPost);
postRouter.route('/searchaccount').get(authenticateToken, searchAccount);



module.exports = {
    postRouter
}