const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('course-express', 'root', 'root', {
	host: 'localhost',
	port: '8889',
	dialect: 'mysql',
	logging: console.log,
	freezeTableName: true,

	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
});

module.exports = sequelize;
