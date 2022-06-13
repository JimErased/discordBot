const http = require('http');
const Sequelize = require('sequelize');
const { Users } = require('/var/www/jimerased.com/html/node/discordBot/dbObjects.js');


const hostname = '192.168.1.101';
const port = 3030;

var highScore = getHighScores();

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.write(highScore);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

async function getHighScores() {
    var highScores = await Users.findAll({ 
        attributes:['username', 'currentScore', 'highScore'],
        limit:10,
        order: [['highScore', 'DESC']],
        raw: true
    });

    var output = '<table><tr><th>Position</th><th>Username</th><th>HighScore</th></tr> \n';

    for (let key in highScores) {
        output = output + '<tr><td>';
        var pos = parseInt(key) + 1;
        output = output + pos + '</td><td>' + highScores[key]['username']
        + '</td><td>' + highScores[key]['highScore'] + '</td></tr> \n';
    }

    output = output +'</table>';

    return output;
}