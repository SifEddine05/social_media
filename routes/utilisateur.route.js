const express = require("express");
const {get_users , signUpUser, signInUser, updateUsername} = require("../models/utilisateur.model");
const utilisateurRouter = express.Router();

utilisateurRouter.route('/test').get(get_users)
utilisateurRouter.route('/signup').post(signUpUser)
utilisateurRouter.route('/signin').post(signInUser)
utilisateurRouter.route('/update_username').post(updateUsername)

module.exports = utilisateurRouter ;