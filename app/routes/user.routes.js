const express = require('express');
const users = require('../controllers/user.controller');
const router = express.Router();
const authenticationMiddleware = require('../middleware/middleware');

router.post('/register', users.register);
router.post('/login', users.login);
// router.get('/message', authenticationMiddleware.authenticateToken, users.sendMessage);
router.post('/refresh-token', users.createNewAccessToken);


module.exports = router;

