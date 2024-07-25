const models = require('../models');
const { Op, where } = require('sequelize');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4, validate } = require('uuid');

const validatationRules = [
    body('reason').notEmpty().withMessage('Reason is required').isString().withMessage('Reason must be a string'),
    body('status').notEmpty().withMessage('status is required'),
    body('start_date').notEmpty().withMessage('Start Date is Required').isISO8601().withMessage('Start Date must be a valid date'),
    body('end_date').notEmpty().withMessage('End Date is Required').isISO8601().withMessage('End Date must be a valid date'),
]

function create(req,res) {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            message: "Validation error!",
            errors: errors.array()
        })
    }
    try {
        
    } catch (error) {
        
    }
}

module.exports = {
    create: [...validatationRules ,create]
}