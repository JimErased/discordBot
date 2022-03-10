const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Users = require('./models/Users.js')(sequelize, Sequelize.DataTypes);

// Update the current score of the user
Reflect.defineProperty(Users.prototype, 'updateCurrentScore', {
	/* eslint-disable-next-line func-name-matching */
	value: async function updateCurrentScore(score) {
		const userCurrentScore = await User.findOne({
			where: { user_id: this.user_id, currentScore: currentScore.id },
		});

		return userCurrentScore.save();
	},
});

// Update the high score of the user
Reflect.defineProperty(Users.prototype, 'updateHighScore', {
	/* eslint-disable-next-line func-name-matching */
	value: async function updateHighScore(score) {
		const userHighScore = await User.findOne({
			where: { user_id: this.user_id, highScore: highScore.id },
		});

		return userHighscore.save();
	},
});

// Reflect.defineProperty(Users.prototype, 'getHighScore'), {
// 	/* eslint-disable-next-line func-name-matching */
// 	value: function getHighScore(user = null) {
//         if (user == null) {
//             return UserItems.max('highScore');
//         }
// 	},
// });

module.exports = { Users };