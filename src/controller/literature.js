const { literatures, users } = require('../../models');
const { Op } = require('sequelize');
const sequelize = require('../database/connection');
const Joi = require('joi');

exports.addLiterature = async (req, res) => {
	// validation schema
	const schema = Joi.object({
		title: Joi.string().required(),
		publication_date: Joi.string().min(10).required(),
		pages: Joi.number().min(1).required(),
		ISBN: Joi.string().min(13).max(13).required(),
		author: Joi.string().required(),
	});

	const { error } = schema.validate(req.body);

	if (error) {
		return res.status(400).send({
			message: error.details[0].message,
		});
	}
	try {
		const { idUser } = req.user;
		// check if literature already exist
		const isExist = await literatures.findOne({
			where: {
				title: req.body.title,
			},
		});

		if (isExist) {
			return res.status(400).send({
				error: {
					message: 'Literature already exist!',
				},
			});
		}

		const attachment = req.file.filename;

		// create literature
		const newLiterature = await literatures.create({
			...req.body,
			idUser,
			attachment,
			status: 'Waiting Approve',
		});

		let showLiterature = await literatures.findOne({
			where: {
				id: newLiterature.id,
			},
			attributes: {
				exclude: ['createdAt', 'updatedAt'],
			},
		});

		res.status(200).send({
			status: 'success',
			data: showLiterature,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			status: 'failed',
			message: 'server error',
		});
	}
};

exports.getLiteratures = async (req, res) => {
	const { title, public_year } = req.query;
	try {
		let data;
		if (!public_year) {
			data = await literatures.findAll({
				where: {
					title: {
						[Op.substring]: title,
					},
				},
				include: {
					model: users,
					as: 'users',
					attributes: {
						exclude: ['createdAt', 'updatedAt'],
					},
				},
				attributes: {
					exclude: ['createdAt', 'updatedAt', 'idUser'],
					include: [
						[
							sequelize.fn('YEAR', sequelize.col('publication_date')),
							'public_year',
						],
					],
				},
				order: [['publication_date', 'DESC']],
			});
		} else {
			data = await literatures.findAll({
				where: {
					[Op.and]: [
						{
							title: {
								[Op.substring]: title,
							},
						},
						{
							year: sequelize.where(
								sequelize.fn('YEAR', sequelize.col('publication_date')),
								public_year
							),
						},
					],
				},
				include: {
					model: users,
					as: 'users',
					attributes: {
						exclude: ['createdAt', 'updatedAt'],
					},
				},
				attributes: {
					exclude: ['createdAt', 'updatedAt', 'idUser'],
					include: [
						[
							sequelize.fn('YEAR', sequelize.col('publication_date')),
							'public_year',
						],
					],
				},
			});
		}

		data = JSON.parse(JSON.stringify(data));

		data.map(item => {
			item.attachment = `${process.env.BASE_URL}/uploads/file/${item.attachment}`;
		});

		res.send({
			status: 'success',
			data,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			status: 'failed',
			message: 'Server error',
		});
	}
};

exports.getLiterature = async (req, res) => {
	try {
		const { id } = req.params;

		let data = await literatures.findOne({
			where: {
				id,
			},
			attributes: {
				exclude: ['createdAt', 'updatedAt'],
			},
		});
		data.attachment = `${process.env.BASE_URL}/uploads/file/${data.attachment}`;

		res.send({
			status: 'success',
			data,
		});
	} catch (error) {
		console.log(error);
		res.send({
			status: 'failed',
			message: 'Server Error',
		});
	}
};

exports.getUserLiterature = async (req, res) => {
	try {
		const { idUser } = req.user;

		let literature = await literatures.findAll({
			where: {
				idUser,
			},
			include: {
				model: users,
				as: 'users',
				attributes: {
					exclude: ['createdAt', 'updatedAt', 'password', 'status', 'address'],
				},
			},
			attributes: {
				exclude: ['createdAt', 'updatedAt', 'idUser'],
				include: [
					[
						sequelize.fn('YEAR', sequelize.col('publication_date')),
						'public_year',
					],
				],
			},
		});

		literature = JSON.parse(JSON.stringify(literature));
		literature.map(
			item =>
				(item.attachment = `${process.env.BASE_URL}/uploads/file/${item.attachment}`)
		);

		res.send({
			status: 'success',
			literature,
		});
	} catch (error) {
		console.log(error);
		res.send({
			status: 'failed',
			message: 'Server Error',
		});
	}
};

exports.updateLiterature = async (req, res) => {
	try {
		const { id } = req.params;

		await literatures.update(
			{
				...req.body,
			},
			{
				where: {
					id,
				},
			}
		);

		let newLiterature = await literatures.findOne({
			where: {
				id,
			},
			attributes: {
				exclude: ['createdAt', 'updatedAt'],
			},
		});

		res.status(200).send({
			status: 'success',
			data: newLiterature,
		});
	} catch (error) {
		res.status(500).send({
			status: 'failed',
			messages: 'server error',
		});
	}
};

exports.deleteLiterature = async (req, res) => {
	try {
		const { id } = req.params;
		await literatures.destroy({
			where: {
				id,
			},
		});

		res.send({
			status: 'success',
			data: {
				id: `${id}`,
			},
		});
	} catch (error) {
		console.log(error);
		res.send({
			status: 'failed',
			message: 'Server Error',
		});
	}
};
