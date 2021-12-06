const {
	collection_literature,
	collections,
	literatures,
	users,
} = require('../../models');
const sequelize = require('../database/connection');
const { Op } = require('sequelize');

exports.addCollectionItem = async (req, res) => {
	try {
		const { idUser } = req.user;
		const { idLiterature, idCollection } = req.body;
		const itemExist = await collection_literature.findOne({
			where: {
				[Op.and]: [{ idLiterature }, { idCollection }],
			},
		});
		if (itemExist) {
			return res.status(400).send({
				status: 'failed',
				messages: 'literature already added',
			});
		}
		let newCollections;
		if (!itemExist) {
			newCollections = await collection_literature.create({
				idUser,
				idLiterature,
				idCollection,
			});
		}
		let showCollection = await collection_literature.findOne({
			where: {
				id: newCollections.id,
			},
			attributes: {
				exclude: ['createdAt', 'updatedAt'],
			},
		});
		res.status(200).send({
			status: 'success',
			messages: `literature succesfully added`,
			data: showCollection,
		});
	} catch (error) {
		res.status(500).send({
			status: 'failed',
			message: 'Server Error',
		});
		console.log(error);
	}
};

exports.getAll = async (req, res) => {
	try {
		const { idUser } = req.user;
		const data = await collection_literature.findAll({
			include: {
				model: collections,
				as: 'collections',
				where: {
					idUser,
				},
				attributes: ['idUser', 'collectionName'],
			},
			attributes: {
				exclude: ['id', 'createdAt', 'updatedAt'],
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

exports.getAllCollectionItem = async (req, res) => {
	try {
		const { idUser } = req.user;
		const { idCollection } = req.params;
		let collection = await collections.findOne({
			where: {
				id: idCollection,
			},
		});

		if (!collection) {
			return res.status(401).send({
				status: 'failed',
				message: 'Access denied due to invalid credentials',
			});
		} else {
			let data = await collection_literature.findAll({
				where: {
					idCollection,
				},
				include: [
					{
						model: collections,
						as: 'collections',
						attributes: {
							exclude: ['createdAt', 'updatedAt', 'id', 'idUser'],
						},
					},
					{
						model: literatures,
						as: 'literatures',
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
				],
				attributes: {
					exclude: ['updatedAt', 'createdAt', 'idLiterature', 'idCollection'],
				},
			});

			data = JSON.parse(JSON.stringify(data));
			if (data.length !== 0 && data[0].idUser === idUser) {
				data.map(item => {
					item.literatures.attachment = `${process.env.BASE_URL}/uploads/file/${item.literatures.attachment}`;
				});

				return res.status(200).send({
					status: 'success',
					data,
				});
			} else if (collection.idUser === idUser) {
				return res.status(200).send({
					status: 'success',
					data,
				});
			} else {
				return res.status(401).send({
					status: 'failed',
					message: 'Access denied due to invalid credentials',
				});
			}
		}
	} catch (error) {
		console.log(error);
		res.send({
			status: 'failed',
			message: 'Server Error',
		});
	}
};

exports.deleteCollectionItem = async (req, res) => {
	try {
		const { idLiterature, idCollection } = req.body;
		await collection_literature.destroy({
			where: {
				[Op.and]: [{ idLiterature }, { idCollection }],
			},
		});
		res.status(200).send({
			status: 'success',
			messages: `literature succesfully deleted`,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			status: 'failed',
			message: 'Server Error',
		});
	}
};
