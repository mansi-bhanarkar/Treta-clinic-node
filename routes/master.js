const express = require('express');
const masterController = require('../controllers/master.controller');
// const checkAuthMiddleware = require('../middleware/check-auth');

const router = express.Router();

router.get('/roles', masterController.roleData);

router.get('/departments', masterController.departmentData);

module.exports = router;
