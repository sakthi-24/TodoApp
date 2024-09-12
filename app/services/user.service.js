const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwtUtils = require("../config/jwt.utils");


exports.register = async ( username, email, password) => {
  try {
    const user = await User.findOne({ email });
    if (user) {
      throw new Error("User already registered");
    }
    let newUser = new User({ username, email, password });
    return newUser.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.login = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid User email");
    }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid Password");
      }
    const accessToken = jwtUtils.generateAccessToken(user);
    const refreshToken = jwtUtils.generateRefreshToken(user);
    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.createNewAccessToken = async (req) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);
  try {
    const user = jwtUtils.verifyRefreshToken(refreshToken);
    const accessToken = jwtUtils.generateAccessToken({_id: user.userId });
    return accessToken ;
  } catch (error) {
    throw new Error("Invalid Refresh Token");
  }
};
