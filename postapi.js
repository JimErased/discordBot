const http = require('http');
const { Users } = require('/var/www/jimerased.com/html/node/discordBot/dbObjects.js');
const qs = require('querystring');
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


function ieuSpeak(data) {
    console.log(data['header'])
    console.log(data['header']['CLIENT_TOKEN'])

}