const { SlashCommandBuilder } = require('@discordjs/builders');
const { Op } = require('sequelize');
const { Collection, Client, Formatters, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const { Users } = require('/var/www/jimerased.com/html/node/discordBot/dbObjects.js');
const scoreTable = new Collection();
/*
 * Make sure you are on at least version 5 of Sequelize! Version 4 as used in this guide will pose a security threat.
 * You can read more about this issue on the [Sequelize issue tracker](https://github.com/sequelize/sequelize/issues/7310).
 */
client.once('ready', async () => {
	const storedScores = await Users.findAll();
	storedScores.forEach(b => scoreTable.set(b.user_id, b));

	console.log(`Logged in as ${client.user.tag}!`);
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cricket')
		.setDescription('Play Brian Lara\'s Cricket'),
        
	async execute(interaction) {
        //console.log("Interaction triggered by ");

        //Functions
        async function probability(i) {
        
            var score = 0;
            var outcome = "";

            switch (true) {
                // Case to set the runs
                case (i < 310):
                    score = 0;
                    outcome = ", you have scored 0 runs.";
                    break;
        
                case (i < 670):
                    score = 1;
                    outcome =  ", you have scored 1 run.";
                    break;
                
                case (i < 720):
                    score = 2;
                    outcome = ", you have scored 2 runs.";
                    break;
        
                case (i < 740):
                    score = 3;
                    outcome =  ", you have scored 3 runs!";
                    break;
                
                case (i < 850):
                    score = 4;
                    outcome = ", you have scored 4 runs!";
                    break;
                
                case (i < 890):
                    score = 6;
                    outcome = ", you have hit a 6!";
                    break;
        
                // Bowled out
                case (i < 970):
                    score = 99;
                    outcome = ", you have been bowled out.";
                    break;
        
                // Save Brian Lara
                case (i < 975):
                    score = 99;
                    outcome = ", you have saved Brian Lara's Cricket! He chirps in your honour.";
                    break;
        
                // Night Train
                case (i < 980):
                    score = 99;
                    outcome = ", you have taken the night train with the hairy bikers.";
                    break;
        
                // Bob Johnson
                case (i < 985):
                    score = 99;
                    outcome = ", 40 Year Old Ukrainian tenis legend Bob Johnson has taken over as bowler. Every ball he bowls is wide. You lose.";
                    break;
                
                // Kebab
                case (i < 990):
                    score = 99;
                    outcome = ", Ieuan's kebab has come to life and has a 100% wicket to bowl ratio. You lose.";
                    break;
        
                // Deli
                case (i > 990):
                    score = 99;
                    outcome = ", Deli Ali opens his Deli in the alley. Lunch is served!";
                    break;
        
                default:
                    score = 0;
                    outcome = ", Jim done fucked up.";
            }
            
            // console.log(score);
            // console.log(outcome);
            return [score, outcome];
        
        }

        async function updateScore(hit) {
            var score = await Users.findAll({ 
                where: { user_id:interaction.user.id },
                attributes: ['currentScore', 'highScore'],
                raw: true
            });

            // console.log('Score: ', score);

            var currentScore = await score[0]['currentScore'];
            var highScore = await score[0]['highScore'];
            // console.log('HighScore: ', highScore);
            // console.log('CurrentScore: ', currentScore);
            // console.log('Hit: ', hit);
        
            if (hit == 99) {
                const affectedRows = await Users.update({ currentScore: 0 }, { where: { user_id: tagUserId } });
            } else {
                currentScore = await currentScore + hit;
                const affectedRows = await Users.update({ currentScore: currentScore }, { where: { user_id: tagUserId } });
            }
        
            if(currentScore > highScore) {
                const updateMax = await Users.update({ highScore: currentScore }, { where: { user_id: tagUserId } })
            }
        
        }

        // interaction.deferReply();

        // Get constants from interaction
        const { commandName } = interaction;
        const tagUserId = interaction.user.id;
        const tagUsername = interaction.user.username;

        console.log(tagUserId);
        
        if (!interaction.isCommand()) return "This is the empty message?";


        // Add new user to the database
        try {
            // equivalent to: INSERT INTO users (name, descrption, username) values (?, ?, ?);
            const tag = await Users.create({
                user_id: tagUserId,
                username: tagUsername,
            });
            interaction.reply({ content: 'Thank you for registering to play Brian Lara\'s Cricket. The world\'s second best cricket game about Brian Lara.', ephemeral: true});

        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                // Run the program and update the values
                var score = await Users.findAll({ 
                    where: { user_id:interaction.user.id },
                    attributes: ['currentScore', 'highScore'],
                    raw: true
                });
                var currentScore = await score[0]['currentScore'];
                var result;
                var currentHit = await probability(diceRoll());
                //console.log(currentHit);
                updateScore(currentHit[0]);
                currentScore = currentScore + currentHit[0];
                var runs = currentHit[0];
                if (currentHit[0] == 99) {
                    currentScore = 0;
                }
                var output = tagUsername + currentHit[1] + ' Your current score is: ' + currentScore + ' runs!'
                interaction.reply(output);
                return console.log('User is in database.');
            } else {
                return console.log(error);
            }
        }
    }
}


// Generate random number between 1 and 1000
function diceRoll () {
	var i = Math.floor(Math.random() * 1000);
	return i;
}
