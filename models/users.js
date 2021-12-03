'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class users extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			users.hasMany(models.literatures, {
				as: 'literatures',
				foreignKey: {
					name: 'idUser',
				},
			});
			users.hasMany(models.collections, {
				as: 'collections',
				foreignKey: {
					name: 'idUser',
				},
			});
		}
	}
	users.init(
		{
			fullName: DataTypes.STRING,
			email: DataTypes.STRING,
			password: DataTypes.STRING,
			phone: DataTypes.STRING,
			address: DataTypes.STRING,
			profilePicture: DataTypes.STRING,
			gender: DataTypes.STRING,
			status: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'users',
		}
	);
	return users;
};
