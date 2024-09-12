const jwtUtils = require('../config/jwt.utils');

exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.replace("Bearer ", "");

  if (token == null) {
    return new Error("Access Denied. No Token Provided."); 
  }

  try {
    const user = jwtUtils.verifyAccessToken(token);
    req.user = user;
    next();
  } catch (error) {
    res.sendStatus(401);
  }
};