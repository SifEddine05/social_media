const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma.client");

const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, "blancos_zo3ama");
    let user;
    

    if (!user) {
      return res
        .status(401)
        .json({ error: "Unauthorized" });
    }
    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authenticateToken;