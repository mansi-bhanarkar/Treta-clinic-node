const models = require('../models');
const { body, validationResult } = require('express-validator');
const { Op, where } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');


// Validation middleware
const validationRules = [
    body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string').isLength({ max: 100 }).withMessage('Name should be less than 100 characters.'),
    body('location').notEmpty().withMessage('Location is required').isString().withMessage('Location must be a string'),
    body('area').notEmpty().withMessage('Area is required').isString().withMessage('Area must be a string'),
    body('city').notEmpty().withMessage('City is required').isString().withMessage('City must be a string'),
    body('pincode').notEmpty().withMessage('Pincode is required'),
    body('email').notEmpty().withMessage('Email is required').isString().withMessage('Email must be a string'),
    body('phone_number').notEmpty().withMessage('Phone number is required')
];
const validationRulesForUpdateStatus = [
    body('is_active').notEmpty().withMessage('is_Active is required').isInt().withMessage('Valid number is required.'),

];
const generateUniqueId = () => {
    return uuidv4();
};

function create(req, res) {
    const userData = req.userData;

    if (userData.user.role_id === 1) {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                message: "Validation error!",
                errors: errors.array()
            });
        }

        const data = {
            name: req.body.name,
            location: req.body.location,
            area: req.body.area,
            city: req.body.city,
            pincode: req.body.pincode,
            email: req.body.email,
            phone_number: req.body.phone_number,
            uuid: generateUniqueId(),
            is_active: 1,
        };

        models.Branche.create(data).then(result => {
            res.status(201).json({
                status: 201,
                message: "Branch saved successfully."
            });
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Something went wrong",
                data: error
            });
        });
    } else {
        res.status(400).json({
            status: 400,
            message: "Bad Request."
        });
    }
}

function show(req, res) {
    const userData = req.userData;

    // if(userData.user.role_id == 1){
    const uuid = req.params.uuid;

    models.Branche.findAll({
        where: {
            uuid: uuid,
            is_active: 1
        }
    }).then(result => {
        // models.Branche.findByPk(id).then(result => {
        res.status(200).json({

            status: 200,
            success: true,
            data: result
        });
    }).catch(error => {
        res.status(500).json({
            message: error,
            status: 500,
            success: false,

        });
    })
    /*  }else{
         res.status(400).json({
             status: 400,
             message: "Bad Request."
         });
     } */
}

function index(req, res) {
    const userData = req.userData;

    // Extract page and limit from query parameters (with default values)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1;
    const offset = (page - 1) * limit;

    return new Promise((resolve, reject) => {
        models.Branche.findAndCountAll({
            // where: { is_active: 1 },
            limit: limit,
            offset: offset
        }).then(result => {
            const totalPages = Math.ceil(result.count / limit);

            resolve({
                status: 200,
                data: result.rows,
                pagination: {
                    totalItems: result.count,
                    totalPages: totalPages,
                    currentPage: page,
                    pageSize: limit
                }
            });
        }).catch(error => {
            reject({
                status: 500,
                message: "Internal Server error. Please try again later."
            });
        });
    })
    .then(result => {
        res.status(200).json(result);
    })
    .catch(error => {
        res.status(500).json(error);
    });
}

async function update(req, res) {
    const userData = req.userData;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation error!",
            errors: errors.array()
        });
    }

    const getuuid = req.params.uuid;
    const updateData = {
        name: req.body.name,
        location: req.body.location,
        area: req.body.area,
        city: req.body.city,
        pincode: req.body.pincode,
        email: req.body.email,
        phone_number: req.body.phone_number,
    };

    if (userData.user.role_id == 1) {
        try {
            let item = await models.Branche.findOne({ where: { uuid: getuuid, is_active: 1 } });

            if (!item) {
                return res.status(404).json({
                    status: 404,
                    message: 'Branch not found'
                });
            }

            await item.update(updateData);

            res.status(200).json({
                status: 200,
                message: 'Branch updated successfully',
                // data: item
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: 'Something went wrong',
                error: error.message
            });
        }
    } else {
        res.status(400).json({
            status: 400,
            message: "Bad Request."
        });
    }
}

async function branchActiveDeactive(req, res) {
    const userData = req.userData;
    const getuuid = req.params.uuid;
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation error!",
            errors: errors.array()
        });
    }
    if (userData.user.role_id == 1) {
        try {
            let item = await models.Branche.findOne({ where: { uuid: getuuid} });

            if (!item) {
                return res.status(404).json({
                    status: 404,
                    message: 'Branch not found'
                });
            }
            const updateData = {
                is_active: req.body.is_active
            };
            await item.update(updateData);

            res.status(200).json({
                status: 200,
                message: 'Branch Updated successfully',
                // data: item
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: 'Something went wrong',
                error: error.message
            });
        }
    } else {
        res.status(400).json({
            status: 400,
            message: "Bad Request."
        });
    }
}
module.exports = {
    create: [...validationRules, create],
    update: [...validationRules, update],
    show: show,
    index: index,
    branchActiveDeactive: [...validationRulesForUpdateStatus,branchActiveDeactive],
};
