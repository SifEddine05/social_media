const express = require("express");
const get_users = require("../models/utilisateur.model");
const { getPostsByUserId,deletePostById } = require("../models/post.model");
const postRouter = express.Router();

postRouter.get('/posts/:user_id', getPostsByUserId);
postRouter.delete('/deletePost/:post_id', deletePostById);
module.exports = postRouter ;