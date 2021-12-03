'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class collections extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			collections.belongsTo(models.users, {
				as: 'users',
				foreignKey: {
					name: 'idUser',
				},
			});
			collections.belongsTo(models.literatures, {
				as: 'literatures',
				foreignKey: {
					name: 'idLiterature',
				},
			});
		}
	}
	collections.init(
		{
			idUser: DataTypes.INTEGER,
			idLiterature: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'collections',
		}
	);
	return collections;
};
