require('dotenv');
const tmi = require('tmi.js');
const fetch = require('node-fetch');
// https://dev.twitch.tv/docs/irc/

//

//

//

//
// Define configuration options

const un = process.env;
console.log(un)
const opts = {
  identity: {
    username: process.env.BOT_USERNAME || 'PUBGSTATS-BOT',
    password: process.env.OAUTH_TOKEN || 'oauth:bz8czlk9mh8as9jvedk125mh6c4zw9'
  },
  channels: [
    process.env.CHANNEL_NAME || 'mainslayermayne'
  ]
};


// PUBG Developer access
const PUBG_API_KEY = process.env.PUBG_API_KEY;


// Create a bot with our options
const bot = new tmi.client(opts);
console.log(opts)
// Register our event handlers (defined below)
bot.on('message', onMessageHandler);
bot.on('connected', onConnectedHandler);

// Connect to Twitch:
bot.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  if (commandName === '!dice') {
    const num = rollDice();
    bot.say(target, `You rolled a ${num}`);
    console.log(`* Executed ${commandName} command`);
  } else if (commandName.includes('!stats ')) {

          console.log(msg)
        if (self) { return; } // Ignore messages from the bot

        // Remove whitespace from chat message
        const userName = msg.slice(msg.indexOf(' ') + 1, msg.length);
        // If the command is known, let's execute it
        if (userName.length > 4) {
          console.log(userName);
          getLG(userName);
        } else {
            console.log(`* Unknown user ${userName}`);
        }
  } else {
    console.log(`* Unknown command ${commandName}`);
  }
}

// GET last game
function getLG(nameEntered) {
  const url = `https://api.pubg.com/shards/steam/players?filter[playerNames]=${nameEntered}`;
  const header = {
  "Authorization": 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIyYWYyZjM2MC04OTVlLTAxMzctOTRhYS00N2ZiNGVlMjNhYjEiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTYzMjE2MTI1LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6ImFqY3JldzIwMDMteWFoIn0.pDzHyh1I0tUMTVkCQ3GakLRGj3DQJMRdEMjBBhOOUUE',
  "Accept": "application/vnd.api+json"
  }
  return fetch(url)
         .then(res => {
           res.json();
           console.log(res.data);
         })
         .catch(console.err)
  // res.data.relationships.matches.data
}

// GET stats from last game
function getStatsFromLG(d) {
  console.log("data ..... : ", d.data);
}

// Function called when the "dice" command is issued
function rollDice () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
