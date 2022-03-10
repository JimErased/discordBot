// JSON parsing
const { SlashCommandBuilder } = require('@discordjs/builders');
const Sequelize = require('sequelize');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]  });
const { Users } = require('/var/www/jimerased.com/html/node/discordBot/dbObjects.js');

client.once('ready', () => {
	console.log('ready');
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('highscore')
		.setDescription('See the current Brian Lara\'s Cricket high score!')
        .setDefaultPermission(true),
	async execute(interaction) {
		async function getHighscores() {
			var highScores = await Users.findAll({ 
				attributes:['username', 'currentScore', 'highScore'],
				limit:10,
				order: [['highScore', 'DESC']],
				raw: true
			});

			var output = 'The current high scores are: \n \n';

			for (let key in highScores) {
				output = output + highScores[key]['username'] + ': ' + highScores[key]['highScore'] + '\n';
			}

			//console.log(output);

			return output;
		}

		var highScores = await getHighscores();
		console.log(highScores);
		interaction.reply(highScores + '\n \n See more scores at https://jimerased.com/leaderboard.php')
	},
};