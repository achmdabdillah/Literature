'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		queryInterface.addColumn(
			'collection_literatures', // table name
			'idUser', // new field name
			{
				type: Sequelize.INTEGER,
				allowNull: true,
			}
		);
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
		 */
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
	},
};
