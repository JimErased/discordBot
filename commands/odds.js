const { SlashCommandBuilder } = require('@discordjs/builders');
const { RichEmbed } = require("discord.js");
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]  });

client.once('ready', async () => {
	console.log(`Odds logged in as ${client.user.tag}!`);
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('odds')
		.setDescription('Challenge a user to a game of odds')
		.addIntegerOption(option => 
			option.setName('int').setDescription('Choose a number between 1 and 20').setRequired(true))
		.addUserOption(option =>
			option.setName('target').setDescription('Choose a user to odds').setRequired(true))
		.addStringOption(option =>
			option.setName('reason').setDescription('Optional: Why are you declaring odds?'))
        .setDefaultPermission(true),
	async execute(interaction) {
		await interaction.deferReply();

		// Assign user variables
		const user1 = interaction.user
		const player1 = {}
		player1.user = interaction.user
		player1.username = interaction.user.username
		player1.int = null
		player1.id = interaction.user.id

		const user2 = interaction.options.getUser('target')
		const player2 = {}
		player2.user = interaction.options.getUser('target')
		player2.username = player2.user.username
		player2.int = null
		player2.id = interaction.user.id

		const limit = interaction.options.getInteger('int');
		const reason = interaction.options.getString('reason');

		if((limit <= 0) || (limit > 20)) {
			await interaction.reply({ content: `${player1.username} has tried to call odds of ${limit}. Come on now.`})
			replied = true
		}

		// Declare the odds have taken place
		await interaction.editReply({ content: `${user1} has challenged the user ${user2} to a game of odds between 1 and ${limit}. ${reason}`, 
			ephemeral: false, fetchReply: true});

		// Create filter so that only the 2 players can get their reply in

		// Filter needs to check that the user is part of the 2 at odds, and their odds value is null
		const filter = interaction => { 
			console.log(player1.int)
			if ((interaction.author.userid == player1.userid) && player1.int == null || (interaction.author.userid == player2.id) && player2.int == null) {
				if (interaction.author.userid == player1.userid) {
					console.log(player1.int)
					player1.int = interaction.content
				} else {
					player2.int = interaction.content
				}
				return interaction.content
			}
		};


		interaction.channel.awaitMessages({ filter, max: 2, time: 16000, errors: ['time'] })
		.then(collected => {
			interaction.followUp(`Both parties have chosen their number has chosen their number.`);
			console.log(player1.int, player2.int)
			console.log(collected)
		})
		.catch(collected => {
			interaction.followUp('Looks like nobody got the answer this time.');
		});

	},
};