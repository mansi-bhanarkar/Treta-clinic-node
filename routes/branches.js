const express = require('express');
const branchController = require('../controllers/branch.controller');
const checkAuthMiddleware = require('../middleware/check-auth');
const router = express.Router();


router.get('/', checkAuthMiddleware.checkauth, branchController.index);
router.post('/create', checkAuthMiddleware.checkauth, branchController.create);
router.get('/show/:uuid', checkAuthMiddleware.checkauth, branchController.show);
router.put('/update/:uuid', checkAuthMiddleware.checkauth, branchController.update);
router.post('/update-status/:uuid', checkAuthMiddleware.checkauth, branchController.branchActiveDeactive);

module.exports = router;
