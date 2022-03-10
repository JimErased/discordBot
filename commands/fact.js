// JSON parsing
const fs = require('fs');
let rawdata = fs.readFileSync('./ieu.json');
let ieuson = JSON.parse(rawdata);
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fact')
		.setDescription('Get a fact about Ieuan')
        .setDefaultPermission(true),
	async execute(interaction) {
		return interaction.reply(getFact());
	},
};
// Create random fact
function getFact () {
	var i = Math.floor(Math.random() * ieuson["facts"].length);
	var ieufact = ieuson["facts"][i];
	return ieufact;
}