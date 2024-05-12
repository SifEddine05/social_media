const express = require("express");
const {get_users, getUserProfile, followUser, unfollowUser, getUserFollowers, getUserFollowings} = require("../models/utilisateur.model");
const utilisateurRouter = express.Router();

utilisateurRouter.route('/test').get(get_users)
utilisateurRouter.route('/user/profile/:userId').get(getUserProfile)
utilisateurRouter.route('/user/follow/').post(followUser)
utilisateurRouter.route('/user/unfollow/').post(unfollowUser)
utilisateurRouter.route('/user/followers/:userId').get(getUserFollowers)
utilisateurRouter.route('/user/followings/:userId').get(getUserFollowings)

module.exports = utilisateurRouter ;