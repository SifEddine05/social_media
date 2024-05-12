const express = require("express");
const get_users = require("../models/utilisateur.model");
const { get_saved_posts } = require("../models/post.model");
const authenticateToken = require("../middleware/token.middleware");
const postRouter = express.Router();

postRouter.route('/getsavedposts').get(authenticateToken,get_saved_posts)

module.exports = {
    postRouter
}