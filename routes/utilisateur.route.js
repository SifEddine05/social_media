const express = require("express");
const get_users = require("../models/utilisateur.model");
const utilisateurRouter = express.Router();

utilisateurRouter.route('/test').get(get_users)

module.exports = utilisateurRouter ;