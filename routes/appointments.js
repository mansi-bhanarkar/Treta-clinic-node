const express = require('express');
const appointmentController = require('../controllers/appointment.controller');
const checkAuthMiddleware = require('../middleware/check-auth');
const router = express.Router();

router.post('/create', checkAuthMiddleware.checkauth, appointmentController.create);
router.put('/update/:case_id', checkAuthMiddleware.checkauth, appointmentController.update);
router.get('/show/:case_id', checkAuthMiddleware.checkauth, appointmentController.getsingleAppointment);
router.get('/:branch_uuid/:doctor_uuid', checkAuthMiddleware.checkauth, appointmentController.getAllAppointment);
router.post('/procedure/create', checkAuthMiddleware.checkauth, appointmentController.createProcedure);
router.get('/procedure/:branch_uuid/:doctor_uuid', checkAuthMiddleware.checkauth, appointmentController.getProcedures);

module.exports = router;
