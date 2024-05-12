const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, "blancos_zo3ama");
    req.user = decoded;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authenticateToken;