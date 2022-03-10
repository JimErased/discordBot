// Require the necessary discord.js classes
const { token } = require('./config.json');
const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const { Users } = require('./dbObjects.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand())
	return "This is not a specified command.";

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return console.log('There was an error while executing this command!');
	}
});


// Generate random insult
function getInsult() {
	var i = Math.floor(Math.random() * ieuson["insults"].length);
	var ieuinsult = ieuson["insults"][i];
	return ieuinsult;
}

client.on('messageCreate', (message) => {
	if (message.author.id === '711289746290376806') {
		message.reply(getInsult());
	}
});

// Login to Discord with your client's token
client.login(token);

