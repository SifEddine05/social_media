const express = require("express");
const postRouter = express.Router();

const { deletePostById, get_saved_posts, add_post, update_post, executeGetRecentPostsFunc, getpostcomments, getPostsByUserId, getmyposts, likePost, savePost, commentPost, searchAccount, UnlikePost, UnsavePost } = require("../models/post.model");
const authenticateToken = require("../middleware/token.middleware");


postRouter.route('/deletePost/:post_id').delete(authenticateToken,deletePostById ) ;

postRouter.route('/getsavedposts').get(authenticateToken,get_saved_posts)

postRouter.route('/addpost').post(authenticateToken,add_post)
postRouter.route('/editpost').put(authenticateToken,update_post)

postRouter.route('/getrecent').get(authenticateToken,executeGetRecentPostsFunc)

postRouter.route('/getpostcomments').get(authenticateToken,getpostcomments) // we must change iit to get the user information

postRouter.route('/getmyposts').get(authenticateToken,getmyposts)
postRouter.route('/postsbyuser/').get(authenticateToken, getPostsByUserId);

postRouter.route('/deletepost/:post_id').delete(authenticateToken, deletePostById);
postRouter.route('/likepost').post(authenticateToken, likePost);
postRouter.route('/unlikepost').post(authenticateToken, UnlikePost);

postRouter.route('/savepost').post(authenticateToken, savePost);
postRouter.route('/unsavepost').post(authenticateToken, UnsavePost);

postRouter.route('/commentpost').post(authenticateToken, commentPost);
postRouter.route('/searchaccount').get(authenticateToken, searchAccount);



module.exports =     postRouter

