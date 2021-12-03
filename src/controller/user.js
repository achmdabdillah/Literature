const { users } = require('../../models');

exports.getUsers = async (req, res) => {
	try {
		const allUser = await users.findAll({
			attributes: {
				exclude: ['profilePicture', 'createdAt', 'updatedAt', 'password'],
			},
		});

		res.send({
			status: 'success',
			data: {
				allUser,
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

exports.getUser = async (req, res) => {
	try {
		const { idUser } = req.user;

		const data = await users.findOne({
			where: {
				id: idUser,
			},
			attributes: {
				exclude: ['createdAt', 'updatedAt', 'password'],
			},
		});
		if (data.profilePicture !== null) {
			data.profilePicture = `${process.env.BASE_URL}/uploads/profilePic/${data.profilePicture}`;
		}

		if (!data) {
			return res.status(404).send({
				status: 'failed',
				message: 'User not found',
			});
		}

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

exports.updateUser = async (req, res) => {
	try {
		const { idUser } = req.user;

		let oldUser = await users.findOne({
			where: {
				id: idUser,
			},
		});
		oldUser = JSON.parse(JSON.stringify(oldUser));

		const profilePicture = req.file
			? req.file.filename
			: oldUser.profilePicture;
		await users.update(
			{
				...req.body,
				profilePicture,
			},
			{
				where: {
					id: idUser,
				},
			}
		);

		const newUser = await users.findOne({
			where: {
				id: idUser,
			},
			attributes: {
				exclude: ['createdAt', 'updatedAt', 'password'],
			},
		});
		res.status(200).send({
			status: 'success',
			data: newUser,
		});
	} catch (error) {
		res.status(500).send({
			status: 'failed',
			messages: 'server error',
		});
	}
};

exports.deleteUser = async (req, res) => {
	try {
		const { id } = req.params;
		await users.destroy({
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
