
const  userService = require("../services/user.service");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const logger = require("../config/logger");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if(!username || !email || ! password){
      res.status(400).json({ error: "Required params not found" });
    }
    await userService.register(username, email, password);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    logger.error(error.message);
    res.status(400).json({ error: "User registration failed" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if(!email || ! password){
      res.status(400).json({ error: "Required params not found" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found.');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }
    const token = await userService.login(email, password);
    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    logger.error(error.message);
    res.status(400).json({ error: error.message });
  }
};

exports.createNewAccessToken = async (req, res) => {
  try {
    const response = await userService.createNewAccessToken(req);
    res.status(200).json(response);
  } catch (error) {
    logger.error(error.message);
    res.status(403).json({ error: error.message });
  }
};



