const express = require("express");
const get_users = require("../models/utilisateur.model");
const { get_saved_posts } = require("../models/post.model");
const postRouter = express.Router();

postRouter.route('/getsavedposts').get(get_saved_posts)

module.exports = {
    postRouter
}