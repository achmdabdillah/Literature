'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		queryInterface.addColumn(
			'literatures', // table name
			'status', // new field name
			{
				type: Sequelize.STRING,
				allowNull: true,
			}
		),
			queryInterface.addColumn(
				'literatures', // table name
				'thumbnail', // new field name
				{
					type: Sequelize.STRING,
					allowNull: true,
				}
			);
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
