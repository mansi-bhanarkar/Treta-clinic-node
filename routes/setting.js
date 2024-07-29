const express = require('express');
const settingController = require('../controllers/setting.controller');
const checkAuthMiddleware = require('../middleware/check-auth');

const router = express.Router();

router.post('/create',checkAuthMiddleware.checkauth,settingController.create);
router.put('/update/:uuid',checkAuthMiddleware.checkauth,settingController.update);
router.get('/',checkAuthMiddleware.checkauth,settingController.getSetting);

module.exports = router;
