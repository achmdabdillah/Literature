'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class literatures extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			literatures.belongsTo(models.users, {
				as: 'users',
				foreignKey: {
					name: 'idUser',
				},
			});
			literatures.hasMany(models.collection_literature, {
				as: 'collection_literature',
				foreignKey: {
					name: 'idLiterature',
				},
			});
		}
	}
	literatures.init(
		{
			title: DataTypes.STRING,
			idUser: DataTypes.INTEGER,
			publication_date: DataTypes.DATE,
			pages: DataTypes.STRING,
			ISBN: DataTypes.STRING,
			author: DataTypes.STRING,
			attachment: DataTypes.STRING,
			status: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'literatures',
		}
	);
	return literatures;
};
