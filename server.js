require('dotenv-safe').config();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const http = require("http");
const port = process.env.PORT || 3000;

const VoiceResponse = require('twilio').twiml.VoiceResponse;
const response = new VoiceResponse();
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

app.use(bodyParser.urlencoded({ extended: true }));

// Add this URL to your Twilio phone number configuration
// for a call comes in.
app.post('/incoming_call', function(req, res) {
  const gather = response.gather({
    input: 'speech dtmf',
    timeout: 3,
    numDigits: 1,
    action: '/enqueue_call'
  });
  gather.say('Please select from the following departments');
  gather.say(
    'For sales press one, for support press two, for marketing press three'
  );
  res.send(response.toString());
});

app.post('/enqueue_call', function(req, res) {
  const response = new VoiceResponse();
  var Digits = req.body.Digits;

  var product = {
    1: 'sales',
    2: 'support',
    3: 'marketing'
  };

  const enqueue = response.enqueue({ workflowSid: process.env.WORKFLOW_SID });
  enqueue.task({}, JSON.stringify({ department: product[Digits], selected_language: 'en' }));

  res.type('text/xml');
  res.send(response.toString());
});

// Add this URL to your Workflow under the
// Assignment Callback section of the Console
app.post('/assignment_callback', function(req, res) {
  // add your Twilio phone number
  var dequeue = {
    instruction: 'dequeue',
    from: process.env.TWILIO_NUMBER, // Your Twilio number.
    status_callback_url: '/status_callback'
  };

  res.type('application/json');
  res.send(dequeue);
});

// Complete task.
app.post("/status_callback", function(req, res){
  const url = require("url");
  const querystring = url.parse(req.url, true);

  client.taskrouter.workspaces(workspaceSid)
  .tasks(querystring.query.TaskSid)
  .update({
    assignmentStatus: 'completed',
    reason: 'call ended successfully'
  })
  .catch(err => {
    console.log(err)
  })
  .then(task => console.log(task.assignmentStatus))
  
})


http.createServer(app).listen(port, () => {
  console.log(`Server is up on port ${port}!`)
});
