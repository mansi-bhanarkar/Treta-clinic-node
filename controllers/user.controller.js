const models = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { Op, where } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { promisify } = require('util');
const { error } = require('console');
// Validation middleware
const validationRules = [
    body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string').isLength({ max: 100 }).withMessage('Name should be less than 100 characters.'),
    body('role_id').notEmpty().withMessage('Role ID is required').isInt().withMessage('Role ID should be an integer.'),
    body('branch_id').notEmpty().withMessage('Branch ID is required').isInt().withMessage('Branch ID should be an integer.'),
    body('phone_number').notEmpty().withMessage('Phone number is required'),
    body('address').notEmpty().withMessage('Address is required').isString().withMessage('Address should be a string.'),
    body('city').notEmpty().withMessage('City is required').isString().withMessage('City should be a string.'),
    body('state').notEmpty().withMessage('State is required').isString().withMessage('State should be a string.'),
    body('country').notEmpty().withMessage('Country is required').isString().withMessage('Country should be a string.'),
    // body('profile_photo').optional().isString().withMessage('Profile photo should be a string.'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email is required.'),
    body('password').notEmpty().withMessage('Password is required').isString().withMessage('Password should be a string.'),
    body('department_id').optional().isInt().withMessage('Department ID should be an integer.'),

];
const validationRulesForUpdate = [
    body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string').isLength({ max: 100 }).withMessage('Name should be less than 100 characters.'),
    body('role_id').notEmpty().withMessage('Role ID is required').isInt().withMessage('Role ID should be an integer.'),
    body('branch_id').notEmpty().withMessage('Branch ID is required').isInt().withMessage('Branch ID should be an integer.'),
    body('phone_number').notEmpty().withMessage('Phone number is required'),
    body('address').notEmpty().withMessage('Address is required').isString().withMessage('Address should be a string.'),
    body('city').notEmpty().withMessage('City is required').isString().withMessage('City should be a string.'),
    body('state').notEmpty().withMessage('State is required').isString().withMessage('State should be a string.'),
    body('country').notEmpty().withMessage('Country is required').isString().withMessage('Country should be a string.'),
    // body('profile_photo').optional().isString().withMessage('Profile photo should be a string.')   
    body('department_id').optional().isInt().withMessage('Department ID should be an integer.'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email is required.'),

];
const validationRulesForLogin = [
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email is required.'),
    body('password').notEmpty().withMessage('Password is required').isString().withMessage('Password should be a string.'),

];
const validationRulesForUpdateStatus = [
    body('is_active').notEmpty().withMessage('is_Active is required').isInt().withMessage('Valid number is required.'),

];
const generateUniqueId = () => {
    return uuidv4();
};
const genSalt = promisify(bcryptjs.genSalt);
const hash = promisify(bcryptjs.hash);

async function create(req, res) {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation error!",
            errors: errors.array()
        });
    }
    const userData = req.userData;
    if (userData.user.role_id == 1) {
        try {
            const salt = await genSalt(10);
            const hashedPassword = await hash(req.body.password, salt);

            const data = {
                name: req.body.name,
                role_id: req.body.role_id,
                branch_id: req.body.branch_id,
                phone_number: req.body.phone_number,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                country: req.body.country,
                profile_photo: req.body.profile_photo,
                email: req.body.email,
                password: hashedPassword,
                department_id: req.body.department_id,
                created_by: userData.user.id,
                updated_by: userData.user.id,
                is_active: 1,
                uuid: generateUniqueId()
            };

            let branch = await models.Branche.findOne({ where: { id: req.body.branch_id, is_active: 1 } });

            if (!branch) {
                return res.status(404).json({
                    status: 404,
                    message: 'Branch not found'
                });
            }

            const result = await models.User.create(data);
            res.status(201).json({
                message: "User saved successfully.",
                status: 201,
                data: result
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
            message: "Unauthorized User."
        });
    }
}

function index(req, res) {
    models.User.findAll(
        // {where:{is_active:1}}
    ).then(result => {
        res.status(200).json({
            status: 200,
            data: result
        });
    }).catch(error => {
        res.status(500).json({
            status: 500,
            data: error
        });
    })
}

async function update(req, res) {
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
    if (userData.user.role_id == 1) {
        try {

            const updateData = {
                name: req.body.name,
                role_id: req.body.role_id,
                branch_id: req.body.branch_id,
                phone_number: req.body.phone_number,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                country: req.body.country,
                profile_photo: req.body.profile_photo,
                email: req.body.email,
                // password: hash,
                department_id: req.body.department_id,
                updated_by: userData.user.id,
            };
            let branch = await models.Branche.findOne({ where: { id: req.body.branch_id, is_active: 1 } });

            if (!branch) {
                return res.status(404).json({
                    status: 404,
                    message: 'Branch not found'
                });
            }
            let user = await models.User.findOne({ where: { uuid: getuuid, is_active: 1 } });

            if (!user) {
                return res.status(404).json({
                    status: 404,
                    message: 'User not found'
                });
            }
            await user.update(updateData);

            res.status(200).json({
                status: 200,
                message: 'User updated successfully',
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

async function userStatusUpdate(req, res) {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation error!",
            errors: errors.array()
        });
    }
    const userData = req.userData;
    const getUuid = req.params.uuid;
    if (userData.user.role_id == 1) {
        try {
            const data = {
                is_active: req.body.is_active
            }
            let user = await models.User.findOne({ where: { uuid: getUuid } });
            if (!user) {
                res.status(404).json({
                    status: 404,
                    message: "User Not found"
                });
            }
            await user.update(data);
            res.status(200).json({
                status: 200,
                message: 'User updated successfully',
                // data: item
            });

        }
        catch (error) {
            res.status(500).json({
                status: 500,
                message: 'Something went wrong',
                error: error.message
            })
        }
    } else {
        res.status(401).json({
            status: 401,
            message: "Unauthorized User"
        })
    }

}

async function show(req, res) {
    const userData = req.userData;
    const getUuid = req.params.uuid;
    if (userData.user.role_id == 1) {
        try {
            let user = await models.User.findOne({ where: { uuid: getUuid } });
            if (!user) {
                res.status(404).json({
                    status: 404,
                    data: "User not found."
                })
            }
            res.status(200).json({
                status: 200,
                data: user
            })

        } catch (error) {
            res.status(500).json({
                status: 500,
                data: error.message
            });

        }

    } else {
        res.status(401).json({
            status: 401,
            message: "Unauthorized User."
        })
    }
}

function login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation error!",
            errors: errors.array()
        });
    }
    models.User.findOne({
        where: {
            email: req.body.email,
            // role_id: 1
        }
    }).then(user => {
        if (user == null) {
            res.status(401).json({
                message: "Invalid Credentials1"
            })
        } else {
            bcryptjs.compare(req.body.password, user.password, function (err, result) {
                if (result) {
                    const token = jwt.sign({
                        user: user
                    }, 'secret', { expiresIn: "8h" })

                    res.status(200).json({
                        message: "Authentication successful",
                        token: token
                    })
                } else {
                    res.status(401).json({
                        message: "Invalid credentials"
                    })
                }
            })
        }
    })
}

async function getSpecificUser(req, res) {
    const roleType = req.body.role;
    if (!roleType) {
        res.status(422).json({
            status: 422,
            message: "Role is Required"
        });
    }
    let getrole = await models.Role.findOne({ where: { id: roleType } });
    if (!getrole) {
        return res.status(404).json({
            status: 404,
            message: "Role not found"
        });
    }

    let getUsers = await models.User.findAll(
        {
            where: {
                role_id: roleType,
                is_active: 1
            }
        }
        , { attributes: ['id', 'name'] });
    if (getUsers.length === 0) {
        return res.status(404).json({
            status: 404,
            message: "Data not found"
        });
    }
    res.status(200).json({
        status: 200,
        message: getUsers
    });
}
module.exports = {
    create: [...validationRules, create],
    login: [...validationRulesForLogin, login],
    update: [...validationRulesForUpdate, update],
    index: index,
    show: show,
    getSpecificUser: getSpecificUser,
    userStatusUpdate: [...validationRulesForUpdateStatus, userStatusUpdate],
};
