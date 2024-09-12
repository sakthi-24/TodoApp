const express = require('express');
const todo = require('../controllers/todo.controller');
const router = express.Router();
const authenticationMiddleware = require('../middleware/middleware');
const paginationData = require('../middleware/pagination');

router.post('/createTodo', authenticationMiddleware.authenticateToken, todo.createTask);
router.put('/updateTodo', authenticationMiddleware.authenticateToken, todo.updateTask);
router.put('/updateStatusTodo', authenticationMiddleware.authenticateToken, todo.updateStatus);
router.delete('/deleteTodo', authenticationMiddleware.authenticateToken, todo.deleteTask);
router.get('/listTask', authenticationMiddleware.authenticateToken, paginationData.parseReqQueryParam,todo.listTask);

module.exports = router;

