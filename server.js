require('dotenv-safe').config({
  allowEmptyValues: true
});

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

const VoiceResponse = require('twilio').twiml.VoiceResponse;
const response = new VoiceResponse();

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/incoming-call', function(req, res) {
  const gather = response.gather({
    input: 'speech dtmf',
    timeout: 3,
    numDigits: 1,
    action: '/enqueue-call'
  });
  gather.say('Please select from the following departments');
  gather.say(
    'For sales press one, for support press two, for marketing press three'
  );
  res.send(response.toString());
});

app.use('/enqueue-call', function(req, res) {
  const response = new VoiceResponse();
  var Digits = req.body.Digits;

  var product = {
    1: 'sales',
    2: 'support',
    3: 'marketing'
  };

  const enqueue = response.enqueue({ workflowSid: 'WWd6af12f07d1b01733fd089d2e2bff705' });
  enqueue.task({}, JSON.stringify({ department: product[Digits], selected_language: 'en' }));

  res.type('text/xml');
  res.send(response.toString());
});

app.use('/assignment-callback', function(req, res) {
  // add your Twilio phone number and WrapUp activity sid
  var dequeue = {
    instruction: 'dequeue',
    from: '+14152126996', // Your Twilio number.
  };

  res.type('application/json');
  res.send(dequeue);
});


server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);