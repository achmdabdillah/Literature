const { collections, literatures, users } = require('../../models');
const sequelize = require('../database/connection');
const { Op } = require('sequelize');

exports.createCollection = async (req, res) => {
	try {
		const { idUser } = req.user;

		const isExist = await collections.findOne({
			where: {
				[Op.and]: [{ idUser }, { collectionName: req.body.collectionName }],
			},
		});

		if (isExist) {
			return res.status(400).send({
				error: {
					message: 'Collection already exist!',
				},
			});
		}
		const newCollections = await collections.create({
			...req.body,
			idUser,
		});

		let showCollection = await collections.findOne({
			where: {
				id: newCollections.id,
			},
			attributes: {
				exclude: ['createdAt', 'updatedAt'],
			},
		});

		res.status(200).send({
			status: 'success',
			data: showCollection,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			status: 'failed',
			message: 'server error',
		});
	}
};

exports.getCollections = async (req, res) => {
	try {
		const data = await collections.findAll({
			include: [
				{
					model: users,
					as: 'users',
					attributes: {
						exclude: [
							'createdAt',
							'updatedAt',
							'password',
							'status',
							'address',
							'id',
						],
					},
				},
				{
					model: literatures,
					as: 'literatures',
					include: {
						model: users,
						as: 'users',
						attributes: {
							exclude: ['createdAt', 'updatedAt'],
						},
					},
					attributes: {
						exclude: ['createdAt', 'updatedAt', 'idCountry', 'id', 'idUser'],
						include: [
							[
								sequelize.fn('YEAR', sequelize.col('publication_date')),
								'public_year',
							],
						],
					},
				},
			],
			attributes: {
				exclude: ['updatedAt', 'id', 'idUser', 'idLiterature', 'createdAt'],
			},
		});

		res.status(200).send({
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

exports.getCollection = async (req, res) => {
	try {
		const { idUser } = req.user;

		let collection = await collections.findAll({
			where: {
				idUser,
			},
			attributes: {
				exclude: ['updatedAt', 'createdAt'],
			},
		});
		res.send({
			status: 'success',
			collection,
		});
	} catch (error) {
		console.log(error);
		res.send({
			status: 'failed',
			message: 'Server Error',
		});
	}
};

exports.getCollectionID = async (req, res) => {
	try {
		const { id } = req.params;

		const col = await collections.findOne({
			include: [
				{
					model: literatures,
					as: 'literatures',
					attributes: {
						include: ['title', 'id'],
					},
					where: {
						id,
					},
				},
			],
		});

		res.send({
			status: 'success',
			col,
		});
	} catch (error) {
		console.log(error);
		res.send({
			status: 'failed',
			message: 'Internal server error',
		});
	}
};

exports.deleteCollection = async (req, res) => {
	try {
		const { id } = req.params;
		await collections.destroy({
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
