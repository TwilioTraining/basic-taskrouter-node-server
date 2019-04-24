# A Basic TaskRouer Node.js Server

## How To Use This Code
1. [Download this repositories code](https://github.com/TwilioTraining/basic-taskrouter-node-server/archive/master.zip) to your computer and unzip the file.
2. From terminal go into the `node-taskrouter-server` directory on your computer.
3. Once in that directory run `npm install` to install all the necessary dependencies.
4. In the `node-taskrouter-server` directory create a `.env` file.
5. Copy the contents of the `.env.example` file into your `.env` file and fill in the missing values. (These values can be found in your Twilio Console Dashboard and TaskRouter Workspace)

## Start Your Server
To start your Node server in terminal type `node server.js`
If you did not change the port number in the `.env` file you will see the following message appear in terminal:
```text
Server is up on port 3000!
```
To stop the server type `control c`.

## Important Note
In order for Twilio to reach your server it will have to be exposed to the internet. If you do not currently have a service like ngrok installed on your computer please do so before trying to run your contact center. You can download a version of ngrok here: https://ngrok.com/.