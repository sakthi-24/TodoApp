const todoService = require("../services/todo.service");
const logger = require("../config/logger");

exports.createTask = async (req, res) => {
  const { title, description } = req.body;
  try {
    if (!title || !description) {
      res.status(400).json({ error: "Required params not found" });
    }
    await todoService.createTask(title, description, req.user.userId);
    res.status(201).json({ message: "Task added successfully" });
  } catch (error) {
    logger.error(error.message);
    res.status(400).send(error);
  }
};

exports.updateTask = async (req, res) => {
  const id = req.query.id;
  const { title, description } = req.body;
  try {
    if (!title || !description || !id) {
      res.status(400).json({ error: "Required params not found" });
    }
    await todoService.updateTask(id, title, description, req.user.userId);
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    logger.error(error.message);
    res.status(400).send(error);
  }
};

exports.updateStatus = async (req, res) => {
  const id = req.query.id;
  const { status, satisfactoryLevel } = req.body;
  try {
    if (!id || !status) {
      res.status(400).json({ error: "Required params not found" });
    }
    await todoService.updateStatus(id, satisfactoryLevel, status);
    res.status(200).json({ message: "Task status updated successfully" });
  } catch (error) {
    logger.error(error.message);
    res.status(400).send(error);
  }
};

exports.deleteTask = async (req, res) => {
  try {
    if (!req.query.id) {
      res.status(400).json({ error: "Required params not found" });
    }
    await todoService.deleteTask(req.query.id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    logger.error(error.message);
    res.status(400).send(error);
  }
};

exports.listTask = async (req, res) => {
  try {
    const taskList = await todoService.listTask(req);
    res.status(200).json({ taskList: taskList });
  } catch (error) {
    logger.error(error.message);
    res.status(400).send(error);
  }
};
