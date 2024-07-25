const express = require('express');
const procedureController = require('../controllers/procedure.controller');
const checkAuthMiddleware = require('../middleware/check-auth');
const router = express.Router();

router.get('/', checkAuthMiddleware.checkauth, procedureController.getProcedures);
router.post('/create', checkAuthMiddleware.checkauth, procedureController.create);
router.put('/update/:uuid', checkAuthMiddleware.checkauth, procedureController.update);

module.exports = router;
