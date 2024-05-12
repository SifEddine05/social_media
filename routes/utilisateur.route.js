const express = require("express");
const {get_users , signUpUser, signInUser, updateUsername, updateEmail, updatePassword} = require("../models/utilisateur.model");
const utilisateurRouter = express.Router();

utilisateurRouter.route('/test').get(get_users)
utilisateurRouter.route('/signup').post(signUpUser)
utilisateurRouter.route('/signin').post(signInUser)
utilisateurRouter.route('/update_username').post(updateUsername)
utilisateurRouter.route('/update_email').post(updateEmail)
utilisateurRouter.route('/update_password').post(updatePassword)

module.exports = utilisateurRouter ;