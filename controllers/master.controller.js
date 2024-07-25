const models = require('../models');
const { Op, where } = require('sequelize');

async function roleData(req, res) {

    let getRoles = await models.Role.findAll({ attributes: ['id', 'name'] });
    if (getRoles.length === 0) {
        return res.status(404).json({
            status: 404,
            message: "Data not found"
        });
    }
    res.status(200).json({
        status: 200,
        message: getRoles
    });
}
async function departmentData(req, res) {

    let getDepartments = await models.Department.findAll({ attributes: ['id', 'name'] });
    if (getDepartments.length === 0) {
        return res.status(404).json({
            status: 404,
            message: "Data not found"
        });
    }
    res.status(200).json({
        status: 200,
        message: getDepartments
    });
}
module.exports = {
    roleData: roleData,
    departmentData: departmentData
}