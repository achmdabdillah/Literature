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
			collections.hasMany(models.collection_literature, {
				as: 'collection_literature',
				foreignKey: {
					name: 'idCollection',
				},
			});
		}
	}
	collections.init(
		{
			idUser: DataTypes.INTEGER,
			collectionName: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'collections',
		}
	);
	return collections;
};
