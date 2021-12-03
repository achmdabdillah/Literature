const { collections, literatures, users } = require('../../models');
const sequelize = require('../database/connection');

exports.addCollection = async (req, res) => {
	try {
		const { idUser } = req.user;
		const { idLiterature } = req.body;

		const collectionExist = await collections.findOne({
			where: {
				idUser,
				idLiterature,
			},
		});

		if (collectionExist) {
			res.status(400).send({
				status: 'failed',
				messages: 'literature already added',
			});
		}
		let newCollections;
		if (!collectionExist) {
			newCollections = await collections.create({
				idUser,
				idLiterature,
			});
		}

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
			messages: 'transaction succesfully added',
			data: showCollection,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			status: 'failed',
			message: 'Server Error',
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
			include: {
				model: literatures,
				as: 'literatures',
				attributes: {
					exclude: ['createdAt', 'updatedAt'],
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
			},
			attributes: {
				exclude: ['updatedAt', 'idLiterature'],
			},
		});
		collection = JSON.parse(JSON.stringify(collection));
		collection.map(item => {
			item.literatures.attachment = `${process.env.BASE_URL}/uploads/file/${item.literatures.attachment}`;
			item.literatures.thumbnail = `${process.env.BASE_URL}/uploads/thumbnail/${item.literatures.thumbnail}`;
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
