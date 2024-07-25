const express = require('express');
const userController = require('../controllers/user.controller');
const checkAuthMiddleware = require('../middleware/check-auth');
const router = express.Router();



router.post('/login', userController.login);
router.get('/', checkAuthMiddleware.checkauth, userController.index);
router.post('/create', checkAuthMiddleware.checkauth, userController.create);
router.get('/show/:uuid', checkAuthMiddleware.checkauth, userController.show);
router.put('/update/:uuid', checkAuthMiddleware.checkauth, userController.update);
router.get('/specific-users', checkAuthMiddleware.checkauth, userController.getSpecificUser);
router.post('/update-status/:uuid', checkAuthMiddleware.checkauth, userController.userStatusUpdate);

module.exports = router;
