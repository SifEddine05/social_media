const express = require("express");
const {get_users , signUpUser, signInUser} = require("../models/utilisateur.model");
const utilisateurRouter = express.Router();

utilisateurRouter.route('/test').get(get_users)
utilisateurRouter.route('/signup').post(signUpUser)
utilisateurRouter.route('/signin').post(signInUser)

module.exports = utilisateurRouter ;