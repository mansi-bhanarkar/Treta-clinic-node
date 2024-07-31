const models = require('../models');
const { Op, where } = require('sequelize');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4, validate } = require('uuid');

const validatationRules = [
    body('working_days')
    .notEmpty().withMessage('Working day is required')
    .isInt().withMessage('Working day must be a number'),
body('appoinment_duration')
    .notEmpty().withMessage('Appointment duration is required')
    .isFloat().withMessage('Appointment duration must be a number'),
body('working_hours')
    .notEmpty().withMessage('Working hours is required'),
body('in_time')
    .notEmpty().withMessage('In time is required')
    .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('In time must be in HH:MM:SS format'),
body('out_time')
    .notEmpty().withMessage('Out time is required')
    .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('Out time must be in HH:MM:SS format'),

]
const generateUniqueId = () => {
    return uuidv4();
};
async function create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation error!",
            errors: errors.array()
        });
    }

    try {
        const userData = req.userData;

        if (userData.user.role_id == 2) {
            const data = {
                working_days: req.body.working_days,
                working_hours: req.body.working_hours,
                appoinment_duration: req.body.appoinment_duration,
                in_time: req.body.in_time,
                out_time: req.body.out_time,
                user_id: userData.user.id,
                created_by: userData.user.id,
                updated_by: userData.user.id,
                uuid: generateUniqueId()
            };

            let setting = await models.Setting.findOne({ where: { user_id: userData.user.id } });

            let message;
            let status;

            if (!setting) {
                await models.Setting.create(data);
                message = "Setting saved successfully.";
                status = 201;
            } else {
                await setting.update(data);
                message = "Setting updated successfully.";
                status = 200;
            }

            res.status(status).json({
                status: status,
                message: message
            });

        } else {
            res.status(400).json({
                status: 400,
                message: "Bad Request.",
                userData: userData
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message
        });
    }
}


async function update(req,res) {
     // Check for validation errors
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
         return res.status(422).json({
             message: "Validation error!",
             errors: errors.array()
         });
     }
 
     const userData = req.userData;
     const getuuid = req.params.uuid;
     if (userData.user.role_id == 2) {
        try {

            const data = {

                working_days:req.body.working_days,
                working_hours:req.body.working_hours,
                appoinment_duration:req.body.appoinment_duration,
                in_time: req.body.in_time,
                out_time: req.body.out_time,
                updated_by: userData.user.id
            }
            let setting = await models.Setting.findOne({ where: { uuid: getuuid } });

            if (!setting) {
                return res.status(404).json({
                    status: 404,
                    message: 'Setting not found'
                });
            }
           
            await setting.update(data);

            res.status(200).json({
                status: 200,
                message: 'setting updated successfully',
                // data: user
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: 'Something went wrong',
                error: error.message
            });
        }

    } else {
        res.status(401).json({
            status: 401,
            message: "Unauthorized User"
        })
    }
}

async function getSetting(req, res) {
    const user_id = req.body.user_id ? req.body.user_id : '';

    try {
        let whereClause = {};

        if (user_id) {
            whereClause.user_id = user_id;
        }

        let getSetting = await models.Setting.findAll({ where: whereClause });

        if (getSetting.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "Data not found"
            });
        }

        res.status(200).json({
            status: 200,
            message: getSetting
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message
        });
    }
}


module.exports = {
    create: [...validatationRules ,create],
    update: [...validatationRules ,update],
    getSetting: getSetting
}