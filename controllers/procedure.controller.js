const models = require("../models");
const { Op, where } = require('sequelize');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

const validation = [
    body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string').isLength({ max: 100 }).withMessage('Name should be less than 100 characters.'),

]
const generateUniqueId = () => {
    return uuidv4();
};

function create(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation error!",
            errors: errors.array()
        });
    }
    try{
        const data = {
            name: req.body.name,
            uuid: generateUniqueId(),
            is_active: 1,
        };
        models.Procedure.create(data).then(result => {
            res.status(201).json({
                status: 201,
                message: "Procedure saved successfully."
            });
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Something went wrong",
                data: error
            });
        });
    }catch(error){
        res.status(500).json({
            status:500,
            message: "something went wrong.",
            error: error.message
        })
    }
}

async function getProcedures(req,res) {
    try{
        let procedures = await models.Procedure.findAll();
        if(procedures.length == 0){
            res.status(404).json({
                status:404,
                message: "Data not found.",
            })    
        }
        res.status(200).json({
            status:200,
            message: procedures,
        })    
    }
    catch(error){
        res.status(500).json({
            status:500,
            message: "something went wrong.",
            error: error.message
        })
    }    
}

async function update(req,res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation error!",
            errors: errors.array()
        });
    }
    try{
        const getUuid = req.params.uuid;
        const updatedata = {
            name:  req.body.name
        }   
        
        let procedure = await models.Procedure.findOne({where:{uuid:getUuid}});
        if(!procedure){
            res.status(400).json({
                status:400,
                message: "Bad Request.",
            });
        }
        await procedure.update(updatedata);
        res.status(200).json({
            status:200,
            message: "Procedure updated successfully.",
        });
    }
    catch(error){
        res.status(500).json({
            status:500,
            message: "Something went wrong.",
            errors: error.message
        });
    }
}

module.exports = {
    create : [...validation,create],
    update : [...validation,update],
    getProcedures : getProcedures
}