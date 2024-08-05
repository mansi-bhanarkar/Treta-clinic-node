const models = require('../models');
const { body, validationResult } = require('express-validator');
const { Op, Where, where } = require('sequelize');
const helper = require('../helper/helper');
const { v4: uuidv4, validate } = require('uuid');

const generateUniqueId = () => {
    return uuidv4();
};
const validationRules = [
    body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string').isLength({ max: 100 }).withMessage('Name should be less than 100 characters.'),
    body('branch_id').notEmpty().withMessage('Branch Name  is required').isInt().withMessage('Branch Name must be a number'),
    body('patient_type').notEmpty().withMessage('patient_type is required').isString().withMessage('patient_type must be a string').isLength({ max: 100 }).withMessage('Name should be less than 100 characters.'),
    body('consultation_id').notEmpty().withMessage('consultation Name  is required').isInt().withMessage('consultation Name must be a number'),
    body('department_id').notEmpty().withMessage('Department Name  is required').isInt().withMessage('Department Name must be a number'),
    body('refering_doctor_id').notEmpty().withMessage('Refering Doctor is required').isInt().withMessage('Refering Doctor must be a number'),
    body('age').notEmpty().withMessage('age is required'),
    body('sex').notEmpty().withMessage('sex is required'),
    body('contact_number').notEmpty().withMessage('Contact Number is required').isInt().withMessage('Contact Number must be a number'),
    body('email_id').notEmpty().withMessage('email_id is required'),
    body('birthday').notEmpty().withMessage('Birthday Date is Required').isISO8601().withMessage('Birthday Date must be a valid date'),
    body('patient_source').notEmpty().withMessage('Patient Source is required'),
    body('time_slot').notEmpty().withMessage('Time slot is required').matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('In time must be in HH:MM:SS format'),

    body('appoinment_date')
        .notEmpty().withMessage('Appointment Date is Required')
        .isISO8601().withMessage('Appointment Date must be a valid date')
        .custom(helper.isFutureAndPresentDate), // Using custom validation function from helper.js

    body('payment_type').notEmpty().withMessage('payment_type is Required'),
    body('amount').notEmpty().withMessage('Amount is Required'),
    // body('payment_refrence_number').optional().isInt().withMessage('payment_refrence_number should be an integer.'),

]; 
const validationRulesForProcedure = [
    body('customer_id')
        .notEmpty().withMessage('Customer ID is required')
        .isInt().withMessage('Customer ID must be a number'),

    body('status_id')
        .notEmpty().withMessage('Status is required')
        .isInt().withMessage('Status must be a number'),

    body('name_of_procedure')
        .notEmpty().withMessage('Name of Procedure is required'),

    body('time_slot')
        .notEmpty().withMessage('Time slot is required')
        .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('Time slot must be in HH:MM:SS format'),

    body('appointment_date')
        .notEmpty().withMessage('Appointment Date is required')
        .isISO8601().withMessage('Appointment Date must be a valid date')
        .custom(helper.isFutureAndPresentDate), // Custom validation function

    body('next_session')
        .optional()
        .isISO8601().withMessage('Next session must be a valid date')
        .custom(helper.isFutureAndPresentDate), // Custom validation function

    body('payment_type')
        .notEmpty().withMessage('Payment type is required'),
    body('payment_status_id')
        .notEmpty().withMessage('Payment status is required'),

    body('amount')
        .notEmpty().withMessage('Amount is required')
        .isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),

    /*   body('payment_reference_number')
          .optional()
          .isInt().withMessage('Payment reference number should be an integer'), */
];
async function create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation error!",
            errors: errors.array()
        });
    }
    try {

        let branch = await models.Branche.findOne({ where: { id: req.body.branch_id } });
        if (!branch) {
            return res.status(404).json({
                status: 404,
                message: "Branch not found"
            });
        }
        let consultation = await models.Consultation.findOne({ where: { id: req.body.consultation_id } });
        if (!consultation) {
            return res.status(404).json({
                status: 404,
                message: "consultation not found"
            });
        }
        let department = await models.Department.findOne({ where: { id: req.body.department_id } });
        if (!department) {
            return res.status(404).json({
                status: 404,
                message: "Department not found"
            });
        }
        let caseId = helper.generateNumericCaseId();
        let appointmentCase = await models.Appointment_booking.findOne({ where: { case_id: caseId } });

        // Check if caseId already exists in the database, generate a new one if it does
        while (appointmentCase) {
            caseId = helper.generateNumericCaseId();
            appointmentCase = await models.Appointment_booking.findOne({ where: { case_id: caseId } });
        }
        let appointment = await models.Appointment_booking.findOne({
            where: {
                time_slot: req.body.time_slot,
                appoinment_date: req.body.appoinment_date,
            }
        });
        if (appointment) {
            return res.status(400).json({
                status: 400,
                message: "This Time And Date are booked please select another Data time."
            });
        }

        const userData = req.userData;
        const data = {
            case_id: caseId,
            name: req.body.name,
            branch_id: req.body.branch_id,
            patient_type: req.body.patient_type,
            consultation_id: req.body.consultation_id,
            age: req.body.age,
            sex: req.body.sex,
            contact_number: req.body.contact_number,
            email_id: req.body.email_id,
            birthday: req.body.birthday,
            refering_doctor_id: req.body.refering_doctor_id,
            patient_source: req.body.patient_source,
            time_slot: req.body.time_slot,
            appoinment_date: req.body.appoinment_date,
            payment_type: req.body.payment_type,
            payment_refrence_number: req.body.payment_refrence_number,
            department_id: req.body.department_id,
            is_active: 1,
            created_by: userData.user.id,
            updated_by: userData.user.id,
        }

        let Appointment_booking = await models.Appointment_booking.create(data);

        const paylog = {
            customer_id: Appointment_booking.id,
            payment_status_id: req.body.payment_status_id,
            amount: req.body.amount,
        }
        let paymentLog = await models.Payment_log.create(paylog);

        res.status(201).json({
            status: 201,
            message: "Appointment booked.",
            caseId: caseId
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "something went wrong.",
            errors: error.message
        });
    }
}

async function getAllAppointment(req, res) {
    console.log("getAllAppointment");

    const { startDate, endDate } = req.body;
    const branchUuid = req.params.branch_uuid;
    const doctor_uuid = req.params.doctor_uuid;
    try {
        // Check if branch exists
        const branch = await models.Branche.findOne({ where: { uuid: branchUuid } });
        if (!branch) {
            return res.status(404).json({
                status: 404,
                message: "Branch not found"
            });
        }

        // Check if user (doctor) exists
        const user = await models.User.findOne({ where: { uuid: doctor_uuid } });
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found"
            });
        }
        // Check if user (setting) exists
        const setting = await models.Setting.findOne({ where: { user_id: user.id } });
        if (!setting) {
            return res.status(404).json({
                status: 404,
                message: "setting not found"
            });
        }

        const appointments = await models.Appointment_booking.findAll({
            where: {
                appoinment_date: {
                    [Op.between]: [startDate, endDate],
                },
                branch_id: branch.id,
                refering_doctor_id: user.id,
            },
            order: [
                ['appoinment_date', 'ASC'], // Sort by appoinment_date ascending
                ['time_slot', 'ASC'], // Then sort by time_slot ascending
            ],
        });
        // Organize appointments into date-wise and time-wise objects
        const dateWiseAppointments = {};
        appointments.forEach(appointment => {
            let date = appointment.appoinment_date;
            if (!(date instanceof Date)) {
                date = new Date(date); // Ensure date is a Date object
            }
            const formattedDate = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD

            if (!dateWiseAppointments[formattedDate]) {
                dateWiseAppointments[formattedDate] = {};
            }

            const timeSlot = appointment.time_slot;
            if (!dateWiseAppointments[formattedDate][timeSlot]) {
                dateWiseAppointments[formattedDate][timeSlot] = [];
            }
            dateWiseAppointments[formattedDate][timeSlot].push(appointment);
        });

        // Generate empty objects for time slots between startTime and endTime with gap
        const startTime = setting.in_time;
        const endTime = setting.out_time;
        const gapInHours = setting.appoinment_duration; // Gap between time slots in hours
        const timeSlots = helper.generateTimeSlots(startTime, endTime, gapInHours);

        const result = {};
        Object.keys(dateWiseAppointments).forEach(date => {
            result[date] = {};
            timeSlots.forEach(timeSlot => {
                if (!dateWiseAppointments[date][timeSlot]) {
                    result[date][timeSlot] = [];
                } else {
                    result[date][timeSlot] = dateWiseAppointments[date][timeSlot];
                }
            });
        });
        res.status(200).json({
            status: 200,
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "something went wrong.",
            errors: error.message
        });
    }
}

async function getDoctorSpecificAppointment(req, res) {

    const { startDate, endDate } = req.body;
    const doctor_uuid = req.params.doctor_uuid;

    try {

        // Check if user (doctor) exists
        const user = await models.User.findOne({ where: { uuid: doctor_uuid } });
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found"
            });
        }
        // Check if user (setting) exists
        const setting = await models.Setting.findOne({ where: { user_id: user.id } });
        if (!setting) {
            return res.status(404).json({
                status: 404,
                message: "setting not found"
            });
        }

        const appointments = await models.Appointment_booking.findAll({
            where: {
                appoinment_date: {
                    [Op.between]: [startDate, endDate],
                },

                refering_doctor_id: user.id,
            },
            order: [
                ['appoinment_date', 'ASC'], // Sort by appoinment_date ascending
                ['time_slot', 'ASC'], // Then sort by time_slot ascending
            ],
        });
        // Organize appointments into date-wise and time-wise objects
        /* const dateWiseAppointments = {};
        appointments.forEach(appointment => {
            let date = appointment.appoinment_date;
            if (!(date instanceof Date)) {
                date = new Date(date); // Ensure date is a Date object
            }
            const formattedDate = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD

            if (!dateWiseAppointments[formattedDate]) {
                dateWiseAppointments[formattedDate] = {};
            }

            const timeSlot = appointment.time_slot;
            if (!dateWiseAppointments[formattedDate][timeSlot]) {
                dateWiseAppointments[formattedDate][timeSlot] = [];
            }
            dateWiseAppointments[formattedDate][timeSlot].push(appointment);
        });

        // Generate empty objects for time slots between startTime and endTime with gap
        const startTime = setting.in_time;
        const endTime = setting.out_time;
        const gapInHours = setting.appoinment_duration; // Gap between time slots in hours
        const timeSlots = helper.generateTimeSlots(startTime, endTime, gapInHours);

        const result = {};
        Object.keys(dateWiseAppointments).forEach(date => {
            result[date] = {};
            timeSlots.forEach(timeSlot => {
                if (!dateWiseAppointments[date][timeSlot]) {
                    result[date][timeSlot] = [];
                } else {
                    result[date][timeSlot] = dateWiseAppointments[date][timeSlot];
                }
            });
        }); */
        res.status(200).json({
            status: 200,
            data: appointments,
            // message: result, // if need a date and time wise code then uncomment above code
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "something went wrong.",
            errors: error.message
        });
    }
}

async function update(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation error!",
            errors: errors.array()
        });
    }
    try {
        const case_id = req.params.case_id;
        let branch = await models.Branche.findOne({ where: { id: req.body.branch_id } });
        if (!branch) {
            return res.status(404).json({
                status: 404,
                message: "Branch not found"
            });
        }
        let consultation = await models.Consultation.findOne({ where: { id: req.body.consultation_id } });
        if (!consultation) {
            return res.status(404).json({
                status: 404,
                message: "consultation not found"
            });
        }
        let department = await models.Department.findOne({ where: { id: req.body.department_id } });
        if (!department) {
            return res.status(404).json({
                status: 404,
                message: "Department not found"
            });
        }
        const userData = req.userData;
        const updateData = {

            name: req.body.name,
            branch_id: req.body.branch_id,
            patient_type: req.body.patient_type,
            consultation_id: req.body.consultation_id,
            age: req.body.age,
            sex: req.body.sex,
            contact_number: req.body.contact_number,
            email_id: req.body.email_id,
            birthday: req.body.birthday,
            refering_doctor_id: req.body.refering_doctor_id,
            patient_source: req.body.patient_source,
            time_slot: req.body.time_slot,
            appoinment_date: req.body.appoinment_date,
            payment_type: req.body.payment_type,
            payment_refrence_number: req.body.payment_refrence_number,
            department_id: req.body.department_id,

            updated_by: userData.user.id,
        }
        let appointment = await models.Appointment_booking.findOne({ where: { case_id: case_id } });
        if (!appointment) {
            return res.status(404).json({
                status: 404,
                message: "Case Not found."
            });
        }
        await appointment.update(updateData);
        let paylog = await models.Payment_log.findOne({ where: { customer_id: appointment.id } });
        if (!paylog) {
            return res.status(404).json({
                status: 404,
                message: "Payment Not found."
            });
        }
        const paylogUpdate = {

            payment_status_id: req.body.payment_status_id,
            amount: req.body.amount,
        }
        await paylog.update(paylogUpdate);
        return res.status(200).json({
            status: 200,
            message: "Appointment Updted.",
            caseId: case_id,
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "something went wrong.",
            errors: error.message
        });
    }
}

async function getsingleAppointment(req, res) {

    const getcase_id = req.params.case_id;

    try {
        // Fetch appointment with associated payment logs
        let appointment = await models.Appointment_booking.findOne({
            where: { case_id: getcase_id },
            include: [{
                model: models.Payment_log,
                as: 'Payment_logs' // Make sure this alias matches the one defined in your association
            }]
        });

        // Check if appointment was found
        if (!appointment) {
            return res.status(404).json({
                status: 404,
                message: "Appointment not found"
            });
        }

        // Return appointment with payment logs
        return res.status(200).json({
            status: 200,
            data: appointment
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error

        });
    }
}

async function createProcedure(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation error!",
            errors: errors.array()
        });
    }
    const getcustomer_id = req.body.customer_id;
    try {
        // Fetch appointment with associated payment logs
        let appointment = await models.Appointment_booking.findOne({
            where: { id: getcustomer_id }

        });

        // Check if appointment was found
        if (!appointment) {
            return res.status(404).json({
                status: 404,
                message: "Appointment not found"
            });
        }
        const userData = req.userData;

        const data = {
            uuid: generateUniqueId(),
            customer_id: getcustomer_id,
            time_slot: req.body.time_slot,
            appointment_date: req.body.appointment_date,
            name_of_procedure: req.body.name_of_procedure,
            procedure_package_details_id: req.body.procedure_package_details_id,
            next_session: req.body.next_session,
            payment_type: req.body.payment_type,
            payment_refrence_number: req.body.payment_refrence_number,
            amount: req.body.amount,
            status_id: req.body.status_id,
            is_active: 1,
            created_by: userData.user.id,
            updated_by: userData.user.id,
        }
        let procedure = await models.Procedure_detail.create(data);

        const paylog = {
            customer_id: getcustomer_id,
            payment_status_id: req.body.payment_status_id,
            procedure_detail_id: procedure.id,
            amount: req.body.amount,
        }
        let paymentLog = await models.Payment_log.create(paylog);

        return res.status(201).json({
            status: 201,
            data: "Procedure Cretaed."
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error

        });
    }
}

async function getProcedures(req, res) {

    const { startDate, endDate } = req.body;
    const branchUuid = req.params.branch_uuid;
    const doctor_uuid = req.params.doctor_uuid;
    try {
        // Check if branch exists
        const branch = await models.Branche.findOne({ where: { uuid: branchUuid } });
        if (!branch) {
            return res.status(404).json({
                status: 404,
                message: "Branch not found"
            });
        }

        // Check if user (doctor) exists
        const user = await models.User.findOne({ where: { uuid: doctor_uuid } });
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found"
            });
        }


        const appointments = await models.Appointment_booking.findAll({
            where: {
                appoinment_date: {
                    [Op.between]: [startDate, endDate],
                },
                branch_id: branch.id,
                refering_doctor_id: user.id,
            },
            include: [{
                model: models.Procedure_detail,
                as: 'Procedure_details' // Make sure this alias matches the one defined in your association
            }]
        });

        res.status(200).json({
            status: 200,
            message: appointments,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "something went wrong.",
            errors: error.message
        });
    }
}

async function getDoctorSpecificProcedure(req, res) {
    console.log("getDoctorSpecificProcedure");
    const { startDate, endDate } = req.body;
    const doctor_uuid = req.params.doctor_uuid;
    try {

        // Check if user (doctor) exists
        const user = await models.User.findOne({ where: { uuid: doctor_uuid } });
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found"
            });
        }


        const appointments = await models.Appointment_booking.findAll({
            where: {
                appoinment_date: {
                    [Op.between]: [startDate, endDate],
                },
                refering_doctor_id: user.id,
            },
            include: [{
                model: models.Procedure_detail,
                as: 'Procedure_details' // Make sure this alias matches the one defined in your association
            }]
        });

        res.status(200).json({
            status: 200,
            data: appointments,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "something went wrong.",
            errors: error.message
        });
    }
}

async function updateProcedure(req, res) {
    let t; // Define t outside try block for proper rollback
    try {
        t = await models.sequelize.transaction(); // Start a new transaction

        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            await t.rollback(); // Rollback transaction on validation error
            return res.status(422).json({
                message: "Validation error!",
                errors: errors.array()
            });
        }

        const getUuid = req.params.uuid;

        // Fetch procedure detail
        let procedureDetail = await models.Procedure_detail.findOne({
            where: { uuid: getUuid },
            transaction: t // Include transaction in the query
        });

        if (!procedureDetail) {
            await t.rollback(); // Rollback transaction if procedure not found
            return res.status(404).json({
                status: 404,
                message: "Procedure Detail not found"
            });
        }

        const userData = req.userData;

        const data = {
            time_slot: req.body.time_slot,
            appointment_date: req.body.appointment_date,
            name_of_procedure: req.body.name_of_procedure,
            procedure_package_details_id: req.body.procedure_package_details_id,
            next_session: req.body.next_session,
            payment_type: req.body.payment_type,
            payment_refrence_number: req.body.payment_refrence_number,
            amount: req.body.amount,
            status_id: req.body.status_id,
            updated_by: userData.user.id,
        };

        // Update procedure detail
        await models.Procedure_detail.update(data, {
            where: { uuid: getUuid },
            transaction: t // Include transaction in the query
        });

        // Create payment log
        const paylog = {
            customer_id: req.body.customer_id,
            payment_status_id: req.body.payment_status_id,
            procedure_detail_id: procedureDetail.id,
            amount: req.body.amount,
        };

        await models.Payment_log.create(paylog, {
            transaction: t // Include transaction in the query
        });

        await t.commit(); // Commit transaction if all operations are successful

        return res.status(200).json({
            status: 200,
            data: "Procedure updated successfully."
        });
    } catch (error) {
        if (t) await t.rollback(); // Ensure transaction is rolled back on error

        console.error(error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

async function getProcedureViaCaseID(req, res) {
    try {
        const caseId = req.params.case_id;
        let appointment = await models.Appointment_booking.findOne({
            where: { case_id: caseId }

        });

        // Check if appointment was found
        if (!appointment) {
            return res.status(404).json({
                status: 404,
                message: "Appointment not found"
            });
        }
        let procedureDetails = await models.Procedure_detail.findAll({
            where: { customer_id: appointment.id }
        });
        return res.status(200).json({
            status: 200,
            data: procedureDetails

        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error

        });
    }
}

async function getSingleProcedure(req, res) {
    try {
        const uuid = req.params.uuid;

        let procedureDetails = await models.Procedure_detail.findOne({
            where: { uuid: uuid }
        });
        if (!procedureDetails) {
            return res.status(404).json({
                status: 404,
                message: "Procedure not found"
            });
        }
        return res.status(200).json({
            status: 200,
            data: procedureDetails

        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error

        });
    }
}


module.exports = {
    create: [...validationRules, create],
    update: [...validationRules, update],
    createProcedure: [...validationRulesForProcedure, createProcedure],
    updateProcedure: [...validationRulesForProcedure, updateProcedure],
    getAllAppointment: getAllAppointment,
    getDoctorSpecificAppointment: getDoctorSpecificAppointment,
    getsingleAppointment: getsingleAppointment,
    getProcedures: getProcedures,
    getDoctorSpecificProcedure: getDoctorSpecificProcedure,
    getProcedureViaCaseID: getProcedureViaCaseID,
    getSingleProcedure: getSingleProcedure,
}