// Require the necessary discord.js classes
const http = require('http');
const { token } = require('./config.json');
const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
let rawdata = fs.readFileSync('./ieu.json');
let ieuson = JSON.parse(rawdata);
const { Users } = require('./dbObjects.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
const express = require('express')
const bodyParser = require('body-parser')

// Create a new instance of express
const app = express()

// create application/json parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Route that receives a POST request to /sms
app.post('/sms', function (req, res) {
  const body = req.body
  res.set('Content-Type', 'application/json')
  res.send(`You sent: ${body} to Express`)
  console.log(body)
  ieuSpeak(body)
})

app.get('/', function (req, res) {
    res.sendFile('/var/www/jimerased.com/html/node/discordBot/index.html')
})

// Tell our app to listen on port 3000
app.listen(3333, function (err) {
  if (err) {
    throw err
  }

  console.log('Server started on port 3333')
})


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

client.on('messageCreate', (message) => {
	if (message.content.includes("?")) {
		message.reply("Can do.");
	}
});

function ieuSpeak(data) {
	postToken = data['header']['CLIENT_TOKEN']
	postChannel = data['body']['CHANNEL_ID']
	postMessage = data['body']['MESSAGE']
	if (postToken != token) {
		console.log("Token mismatch")
		return
	} else { 
		console.log("Token Accepted")
		var channel = client.channels.cache.get(postChannel)
		channel.send(postMessage)
	}
}

// Login to Discord with your client's token
client.login(token);

