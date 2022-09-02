const { SlashCommandBuilder } = require('@discordjs/builders');
const { RichEmbed } = require("discord.js");
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]  });

client.once('ready', async () => {
	console.log(`Odds logged in as ${client.user.tag}!`);
});

let sleep = async (ms) => await new Promise(r => setTimeout(r,ms));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('odds')
		.setDescription('Challenge a user to a game of odds')
		.addIntegerOption(option => 
			option.setName('int').setDescription('Choose a number between 1 and 20').setRequired(true))
		.addUserOption(option =>
			option.setName('target').setDescription('Choose a user to odds').setRequired(true))
		.addStringOption(option =>
			option.setName('reason').setDescription('Optional: Why are you declaring odds?').setRequired(true))
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
		player2.id = user2.id

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
			console.log(`Limit: ${limit}`)
			if (((interaction.author.id == player1.id) && player1.int == null) || ((interaction.author.id == player2.id) && player2.int == null)) {
				console.log(interaction.content)
				if (interaction.author.id == player1.id && !isNaN(interaction.content)) {
					if((interaction.content > limit || interaction.content < 1)) {
						interaction.delete(interaction.id)
						interaction.channel.send(`${user1} has chosen ${interaction.content}. How lame.`);
						return
					} else { 
						player1.int = interaction.content
						interaction.delete(interaction.id)
						interaction.channel.send(`${user1} has chosen their number.`);
						console.log(`P1: ${player1.name} ${interaction.content}`)
						return player1.int
					}
				}
				if (interaction.author.id == player2.id && !isNaN(interaction.content)) {
					if((interaction.content > limit || interaction.content < 1)) {
						interaction.delete(interaction.id)
						interaction.channel.send(`${user1} has chosen ${interaction.content}. How lame.`);
						return
					} else { 
						player2.int = interaction.content
						interaction.delete(interaction.id)
						interaction.channel.send(`${user2} has chosen their number.`);
						console.log(`P2: ${player2.name} ${interaction.content}`)
						return player2.int
					}
				}
			}
		};


		interaction.channel.awaitMessages({ filter, max: 2, time: 120000, errors: ['time'] })
		.then(collected => {
			sleep(5000)
			interaction.followUp(`${user1} chose ${player1.int} and ${user2} chose ${player2.int}`);
			if (player1.int == player2.int) {
				interaction.followUp(`Wow. Looks like ${user2} lost at odds of ${limit}/1! Unlucky! Now they'll have to ${reason}`)
			} else {
				interaction.followUp(`Better luck next time ${user1}. ${reason} will not have to happen.`)
			}
		})
		.catch(collected => {
			if (player1.int == null) {
				interaction.followUp(`${user1} Didn't choose a number!`);
			} else {
				interaction.followUp(`${user2} Didn't choose a number!`);
			}
		});

	},
};