const express = require("express");

const {get_users, getUserProfile, followUser, unfollowUser, getUserFollowers,getUserFollowingsById,getUserFollowersById, getUserFollowings, signUpUser, signInUser, updateUsername, updateEmail, updatePassword, updateBio, updateProfile,getMyProfile,getAllUsers} = require("../models/utilisateur.model");
const authenticateToken = require("../middleware/token.middleware");
const utilisateurRouter = express.Router();

utilisateurRouter.route('/test').get(get_users)
utilisateurRouter.route('/user/profile/:userId').get(authenticateToken,getUserProfile)
utilisateurRouter.route('/user/follow/').post(authenticateToken,followUser)
utilisateurRouter.route('/user/unfollow/').post(authenticateToken,unfollowUser)
utilisateurRouter.route('/user/followers/').get(authenticateToken,getUserFollowers)
utilisateurRouter.route('/user/followers/:userId').get(authenticateToken,getUserFollowersById)
utilisateurRouter.route('/user/followings/').get(authenticateToken,getUserFollowings)
utilisateurRouter.route('/user/followings/:userId').get(authenticateToken,getUserFollowingsById)
utilisateurRouter.route('/myProfile/').get(authenticateToken,getMyProfile)
utilisateurRouter.route('/allUsers/').get(authenticateToken,getAllUsers)
utilisateurRouter.route('/signup').post(signUpUser)
utilisateurRouter.route('/signin').post(signInUser)
utilisateurRouter.route('/update_username').post(updateUsername)
utilisateurRouter.route('/update_email').post(updateEmail)
utilisateurRouter.route('/update_password').post(updatePassword)
utilisateurRouter.route('/update_profile').post(updateProfile)


module.exports = utilisateurRouter ;