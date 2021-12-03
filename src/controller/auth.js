const { users } = require('../../models');

// get joi validation
const Joi = require('joi');

// get bcrypt
const bcrypt = require('bcrypt');

// get jsonwebtoken
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
	// validation schema
	const schema = Joi.object({
		fullName: Joi.string().min(5).required(),
		email: Joi.string().email().min(6).required(),
		password: Joi.string().min(6).required(),
		phone: Joi.number().min(9).required(),
		address: Joi.string().min(5).required(),
		gender: Joi.string().required(),
	});

	const { error } = schema.validate(req.body);

	if (error) {
		return res.status(400).send({
			error: {
				message: error.details[0].message,
			},
		});
	}
	try {
		// check if email already used
		const isExist = await users.findOne({
			where: {
				email: req.body.email,
			},
		});

		if (isExist) {
			return res.status(400).send({
				error: {
					message: 'email is already taken',
				},
			});
		}

		// if email is available, create a new user
		const hashedPassword = await bcrypt.hash(req.body.password, 10);

		let newUser = await users.create({
			...req.body,
			password: hashedPassword,
			profilePicture: null,
			status: 'user',
		});
		newUser = JSON.parse(JSON.stringify(newUser));

		// generate token
		const token = jwt.sign(
			{ idUser: newUser.id, status: newUser.status },
			process.env.ACCESS_TOKEN_SECRET
		);

		res.status(200).send({
			status: 'success',
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			status: 'failed',
			message: 'server error',
		});
	}
};

exports.login = async (req, res) => {
	// validation schema
	const schema = Joi.object({
		email: Joi.string().email().min(6).required(),
		password: Joi.string().min(6).required(),
	});

	const { error } = schema.validate(req.body);

	if (error) {
		return res.status(400).send({
			error: {
				message: error.details[0].message,
			},
		});
	}

	try {
		// check if user is exist
		const userExist = await users.findOne({
			where: {
				email: req.body.email,
			},
		});
		// check if the password valid
		const isValid = await bcrypt.compare(req.body.password, userExist.password);

		if (!isValid || !userExist) {
			return res.status(400).send({
				status: 'failed',
				message: 'please input the correct email and password',
			});
		}

		// if valid
		// generate token
		const token = jwt.sign(
			{ idUser: userExist.id, status: userExist.status },
			process.env.ACCESS_TOKEN_SECRET
		);

		if (userExist.profilePicture !== null) {
			userExist.profilePicture = `${process.env.BASE_URL}/uploads/profilePic/${userExist.profilePicture}`;
		}
		res.status(200).send({
			status: 'success',
			id: userExist.id,
			username: userExist.email,
			status: userExist.status,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			status: 'failed',
			message: 'Server Error',
		});
	}
};

exports.checkAuth = async (req, res) => {
	try {
		const id = req.user.idUser;

		const dataUser = await users.findOne({
			where: {
				id,
			},
			attributes: {
				exclude: ['createdAt', 'updatedAt', 'password'],
			},
		});

		if (!dataUser) {
			return res.status(404).send({
				status: 'failed',
			});
		}

		if (dataUser.profilePicture !== null) {
			dataUser.profilePicture = `${process.env.BASE_URL}/uploads/profilePic/${dataUser.profilePicture}`;
		}
		res.send({
			status: 'success',
			data: {
				id: dataUser.id,
				name: dataUser.fullName,
				email: dataUser.email,
				status: dataUser.status,
				profilePicture: dataUser.profilePicture,
			},
		});
	} catch (error) {
		console.log(error);
		res.status({
			status: 'failed',
			message: 'Server Error',
		});
	}
};
