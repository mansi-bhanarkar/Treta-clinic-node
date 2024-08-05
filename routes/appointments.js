const express = require('express');
const appointmentController = require('../controllers/appointment.controller');
const packageController = require('../controllers/package.controller.');
const checkAuthMiddleware = require('../middleware/check-auth');
const router = express.Router();

router.post('/create', checkAuthMiddleware.checkauth, appointmentController.create);
router.put('/update/:case_id', checkAuthMiddleware.checkauth, appointmentController.update);
router.get('/show/:case_id', checkAuthMiddleware.checkauth, appointmentController.getsingleAppointment);
router.get('/all-procedure/:doctor_uuid', checkAuthMiddleware.checkauth, appointmentController.getDoctorSpecificProcedure);
router.get('/procedure/:branch_uuid/:doctor_uuid', checkAuthMiddleware.checkauth, appointmentController.getProcedures);
router.get('/:doctor_uuid', checkAuthMiddleware.checkauth, appointmentController.getDoctorSpecificAppointment);



router.post('/procedure/create', checkAuthMiddleware.checkauth, appointmentController.createProcedure);
router.put('/procedure/update/:uuid', checkAuthMiddleware.checkauth, appointmentController.updateProcedure);
router.get('/procedure/:case_id', checkAuthMiddleware.checkauth, appointmentController.getProcedureViaCaseID);
router.get('/show/procedure/:uuid', checkAuthMiddleware.checkauth, appointmentController.getSingleProcedure);


router.post('/package/create/:case_id', checkAuthMiddleware.checkauth, packageController.create);
router.put('/package/update/:uuid', checkAuthMiddleware.checkauth, packageController.update);
router.get('/package/:uuid', checkAuthMiddleware.checkauth, packageController.getAllPackage);
router.post('/package/update-status/:uuid', checkAuthMiddleware.checkauth, packageController.updateStatusForPackage);
router.post('/package/detail/update-status/:uuid', checkAuthMiddleware.checkauth, packageController.updateStatusPackageDetail);
router.get('/package/procedure/:case_id', checkAuthMiddleware.checkauth, packageController.getProcedurePackage);

router.get('/:branch_uuid/:doctor_uuid', checkAuthMiddleware.checkauth, appointmentController.getAllAppointment);


module.exports = router;
