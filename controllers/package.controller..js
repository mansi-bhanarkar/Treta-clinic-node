const models = require('../models');
const { body, validationResult } = require('express-validator');
const { Op, Where, where } = require('sequelize');
const helper = require('../helper/helper');
const { v4: uuidv4, validate } = require('uuid');


const validationRules = [
    body('name').isString().withMessage('Name must be a string'),
    body('total_amount').isInt({ min: 0 }).withMessage('Total amount must be a positive integer'),
    body('customer_id').isInt({ min: 1 }).withMessage('Customer ID must be a positive integer'),
    body('packages').isArray({ min: 1 }).withMessage('Packages must be a non-empty array'),
    body('packages.*.procedure_id').notEmpty().withMessage('Procedure id is required'),
    body('packages.*.amount').isInt({ min: 0 }).withMessage('Amount must be a positive integer'),

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

    const t = await models.sequelize.transaction(); // Start a new transaction

    try {
        const caseID = req.params.case_id;
        let appointment = await models.Appointment_booking.findOne({
            where: { case_id: caseID, id: req.body.customer_id },
            transaction: t // Include transaction in the query
        });

        if (!appointment) {
            await t.rollback(); // Rollback transaction if appointment is not found
            return res.status(404).json({
                status: 404,
                message: "Appointment not found"
            });
        }

        const userData = req.userData;

        const procedure_masterData = {
            uuid: generateUniqueId(),
            customer_id: appointment.id,
            name: req.body.name,
            total_amount: req.body.total_amount,
            is_active: 1,
            created_by: userData.user.id,
            updated_by: userData.user.id,
        };

        let procedureMaster = await models.Procedure_package.create(procedure_masterData, { transaction: t });

        const arrayOfPackages = req.body.packages;
        const procedureDetailsPromises = arrayOfPackages.map(async (element) => {
            let procedure = await models.Procedure.findOne({
                where: { uuid: element.procedure_id },
                transaction: t // Include transaction in the query
            });

            if (!procedure) {
                await t.rollback(); // Rollback transaction if procedure is not found
                return res.status(404).json({
                    status: 404,
                    message: "Procedure not found"
                });
            }

            const procedure__detailsData = {
                uuid: generateUniqueId(),
                procedure_package_id: procedureMaster.id,
                procedure_id: procedure.id,
                amount: element.amount,
                no_of_session: element.no_of_Session,
                is_active: 1,
                created_by: userData.user.id,
                updated_by: userData.user.id,
            };

            return models.Procedure_package_detail.create(procedure__detailsData, { transaction: t });
        });

        await Promise.all(procedureDetailsPromises); // Wait for all promises to resolve

        await t.commit(); // Commit transaction if all operations are successful

        res.status(200).json({
            status: 200,
            message: "Procedures package created successfully."
        });

    } catch (error) {
        await t.rollback(); // Ensure transaction is rolled back on error
        res.status(500).json({
            status: 500,
            message: "Something went wrong.",
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

    const t = await models.sequelize.transaction(); // Start a new transaction
    try {
        const uuid = req.params.uuid;

        let procedurePackage = await models.Procedure_package.findOne({
            where: { uuid: uuid },
            transaction: t // Include transaction in the query
        });

        if (!procedurePackage) {
            await t.rollback(); // Rollback transaction if procedurePackage is not found
            return res.status(404).json({
                status: 404,
                message: "Procedure package not found"
            });
        }

        const userData = req.userData;

        const procedure_masterData = {
            customer_id: req.body.id,
            name: req.body.name,
            total_amount: req.body.total_amount,
            updated_by: userData.user.id,
        };

        // Correctly update the procedurePackage record
        await models.Procedure_package.update(procedure_masterData, {
            where: { uuid: uuid },
            transaction: t
        });

        const arrayOfPackages = req.body.packages;
        const procedureDetailsPromises = arrayOfPackages.map(async (element) => {
            let procedure = await models.Procedure.findOne({
                where: { uuid: element.procedure_id },
                transaction: t // Include transaction in the query
            });

            if (!procedure) {
                return res.status(404).json({
                    status: 404,
                    message: "Procedure not found"
                });
            }

            let procedure_detail = await models.Procedure_package_detail.findOne({
                where: { uuid: element.procedure_detail_id },
                transaction: t // Include transaction in the query
            });

            if (!procedure_detail) {
                // throw new Error("Procedure package details not found");
                return res.status(404).json({
                    status: 404,
                    message: "Procedure package details not found"
                });
            }

            const procedure__detailsData = {
                amount: element.amount,
                no_of_session: element.no_of_Session,
                updated_by: userData.user.id,
            };

            // Correctly update the procedure_detail record
            return models.Procedure_package_detail.update(procedure__detailsData, {
                where: { uuid: element.procedure_detail_id },
                transaction: t
            });
        });

        await Promise.all(procedureDetailsPromises); // Wait for all promises to resolve

        await t.commit(); // Commit transaction if all operations are successful

        res.status(200).json({
            status: 200,
            message: "Procedures package updated successfully."
        });
    } catch (error) {
        await t.rollback(); // Ensure transaction is rolled back on error
        res.status(500).json({
            status: 500,
            message: "Something went wrong.",
            errors: error.message
        });
    }
}

async function getAllPackage(req, res) {
    const getpackageUuid = req.params.uuid;
    try {
        let procedurePackage = await models.Procedure_package.findOne({
            where: { uuid: getpackageUuid },
            include: [{
                model: models.Procedure_package_detail,
                as: 'Procedure_package_details' // Use the correct alias here
            }]
        });

        // Check if `procedurePackage` is null, not an array
        if (!procedurePackage) {
            return res.status(404).json({
                status: 404,
                message: "Data not found.",
            });
        }

        res.status(200).json({
            status: 200,
            data: procedurePackage,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Something went wrong.",
            errors: error.message
        });
    }
}

async function updateStatusForPackage(req, res) {

    try {
        const packageuuid = req.params.uuid;
        const t = await models.sequelize.transaction(); // Start a new transaction

        let package = await models.Procedure_package.findOne({
            where: { uuid: packageuuid },
            transaction: t // Include transaction in the query

        });

        if (!package) {
            await t.rollback(); // Ensure transaction is rolled back on error
            return res.status(404).json({
                status: 404,
                message: "Package not found"
            });
        }
        const userData = req.userData;
        const data = {
            is_active: req.body.is_active,
            updated_by: userData.user.id,
        }
        await models.Procedure_package.update(data, {
            where: { uuid: packageuuid },
            transaction: t // Include transaction in the query
        });

        await models.Procedure_package_detail.update(data, {
            where: { procedure_package_id: package.id },
            transaction: t // Include transaction in the query

        });
        await t.commit(); // Commit transaction if all operations are successful

        return res.status(200).json({
            status: 200,
            message: "Package status updated"
        });
    } catch (error) {
        await t.rollback(); // Ensure transaction is rolled back on error

        return res.status(500).json({
            status: 500,
            message: "Something went wrong.",
            errors: error.message
        });
    }
}

async function updateStatusPackageDetail(req, res) {
    let t; // Define t outside the try block to handle rollback in catch block
    try {
        const packageDetailuuid = req.params.uuid;
        t = await models.sequelize.transaction(); // Start a new transaction

        let packageDetail = await models.Procedure_package_detail.findOne({
            where: { uuid: packageDetailuuid },
            transaction: t // Include transaction in the query
        });

        if (!packageDetail) {
            await t.rollback(); // Ensure transaction is rolled back on error
            return res.status(404).json({
                status: 404,
                message: "Package Detail not found"
            });
        }

        let package = await models.Procedure_package.findOne({
            where: { id: packageDetail.procedure_package_id },
            transaction: t // Include transaction in the query
        });

        if (!package) {
            await t.rollback(); // Ensure transaction is rolled back on error
            return res.status(404).json({
                status: 404,
                message: "Package not found"
            });
        }

        const userData = req.userData;
        const data = {
            is_active: req.body.is_active,
            updated_by: userData.user.id,
        };

        // Define total_amount here to ensure it's in scope for both conditions
        let total_amount;

        if (req.body.is_active == 0) {
            total_amount = package.total_amount - packageDetail.amount;
        } else {
            total_amount = packageDetail.amount + package.total_amount;
        }
        console.log('total_amount', total_amount);


        await models.Procedure_package_detail.update(data, {
            where: { uuid: packageDetailuuid },
            transaction: t // Include transaction in the query
        });

        const packageDetaildata = {

            updated_by: userData.user.id,
            total_amount: total_amount
        };

        await models.Procedure_package.update(packageDetaildata, {
            where: { id: packageDetail.procedure_package_id },
            transaction: t // Include transaction in the query
        });

        await t.commit(); // Commit transaction if all operations are successful

        return res.status(200).json({
            status: 200,
            message: "Package details status updated"
        });
    } catch (error) {
        if (t) await t.rollback(); // Ensure transaction is rolled back on error

        return res.status(500).json({
            status: 500,
            message: "Something went wrong.",
            errors: error.message
        });
    }
}

async function getProcedurePackage(req, res) {
    const caseID = req.params.case_id;
    let appointment = await models.Appointment_booking.findOne({
        where: { case_id: caseID }
    });

    if (!appointment) {
        return res.status(404).json({
            status: 404,
            message: "Appointment not found"
        });
    }

    try {
        let procedurePackage = await models.Procedure_package.findOne({
            where: { customer_id: appointment.id },
            include: [{
                model: models.Procedure_package_detail,
                as: 'Procedure_package_details' // Use the correct alias here
            }]
        });

        // Check if `procedurePackage` is null, not an array
        if (!procedurePackage) {
            return res.status(404).json({
                status: 404,
                message: "Data not found.",
            });
        }

        res.status(200).json({
            status: 200,
            data: procedurePackage,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Something went wrong.",
            errors: error.message
        });
    }
}

module.exports = {
    create: [...validationRules, create],
    update: [...validationRules, update],
    getAllPackage: getAllPackage,
    updateStatusForPackage: updateStatusForPackage,
    updateStatusPackageDetail: updateStatusPackageDetail,
    getProcedurePackage: getProcedurePackage,
}