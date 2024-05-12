const express = require("express");
const {get_users, getUserProfile, followUser, unfollowUser, getUserFollowers, getUserFollowings, signUpUser, signInUser, updateUsername} = require("../models/utilisateur.model");
const authenticateToken = require("../middleware/token.middleware");
const utilisateurRouter = express.Router();

utilisateurRouter.route('/test').get(get_users)
utilisateurRouter.route('/user/profile/:userId').get(authenticateToken,getUserProfile)
utilisateurRouter.route('/user/follow/').post(authenticateToken,followUser)
utilisateurRouter.route('/user/unfollow/').post(authenticateToken,unfollowUser)
utilisateurRouter.route('/user/followers/:userId').get(authenticateToken,getUserFollowers)
utilisateurRouter.route('/user/followings/:userId').get(authenticateToken,getUserFollowings)
utilisateurRouter.route('/signup').post(signUpUser)
utilisateurRouter.route('/signin').post(signInUser)
utilisateurRouter.route('/update_username').post(updateUsername)
module.exports = utilisateurRouter ;