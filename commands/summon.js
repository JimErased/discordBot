// JSON parsing
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('summon')
		.setDescription('Ieubot will try to summon his master')
        .setDefaultPermission(true),
	async execute(interaction) {
		return interaction.reply('BY THE POWER VESTED IN ME, BY THE WELSH-SINGAPOREAN COUNCIL OF ELDERS, I SUMMON THEE MASTER!!!');
	},
};