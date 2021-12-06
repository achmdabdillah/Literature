'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class collection_literature extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			collection_literature.belongsTo(models.users, {
				as: 'users',
				foreignKey: {
					name: 'idUser',
				},
			});
			collection_literature.belongsTo(models.collections, {
				as: 'collections',
				foreignKey: {
					name: 'idCollection',
				},
			});
			collection_literature.belongsTo(models.literatures, {
				as: 'literatures',
				foreignKey: {
					name: 'idLiterature',
				},
			});
		}
	}
	collection_literature.init(
		{
			idUser: DataTypes.INTEGER,
			idLiterature: DataTypes.INTEGER,
			idCollection: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'collection_literature',
		}
	);
	return collection_literature;
};
