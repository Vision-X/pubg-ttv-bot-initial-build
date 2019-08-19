require('dotenv').config();
const tmi = require('tmi.js');
const fetch = require('node-fetch');
const fs = require('fs');

// https://dev.twitch.tv/docs/irc/

// Define configuration options

// TWITCH CREDENTIALS
const BOT_NAME = process.env.BOT_USERNAME;
const BOT_TOKEN = process.env.OAUTH_TOKEN;
const CHANNEL = process.env.CHANNEL_NAME;
// PUBG CREDNTIALS
const PUBG_API_KEY = process.env.PUBG_API_KEY;

const opts = {
  identity: {
    username: BOT_NAME,
    password: BOT_TOKEN,
  },
  channels: [
    CHANNEL,
  ]
};
// Global temp
var userName;

// Create a bot with our options
const bot = new tmi.client(opts);

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
  // var commandName = msg.slice(0, msg.indexOf(" ") || msg.length+1);
  console.log("Command Name === ", commandName);
  // console.log("full msg === ", msg);

  // If the command is known, let's execute it
  if (commandName === '!dice') {
    const num = rollDice();
    bot.say(target, `You rolled a ${num}`);
    console.log(`* Executed ${commandName} command`);
  }

  if (commandName.includes('!stats')) {
      console.log("** !stats IF BLOCK **");
      userName = msg.slice(msg.indexOf(' ') + 1, msg.length);
      // console.log("userName : ", userName.trim());
      // Remove whitespace from chat message
      // const userName = msg.slice(msg.indexOf(' ') + 1, msg.length);
      // bot.say(target, `You entered UserName ${userName}`);
      // If the command is known, let's execute it
    if (userName) {
        console.log("** Username Exists IF BLOCK **");
        console.log("Username: ", userName);
        fetchPlayer(userName)
                  .then(res => res.json())
                  .then(json => saveFetch(json))
                  .then(matches => getMatches(matches))
                  .then(matchAry => saveMatches(matchAry))
                  .then(id => fetchMatchData(id))
                  .then(newRes => newRes.json())
                  .then(json2 => saveMatchData(userName, json2))
                  .catch(console.err)
    } else {
        console.log(`* Unknown user ${userName}`);
    }
  } else {
      console.log(`* Unknown command ${commandName}`);
  }
}

// GET last game
function fetchPlayer(nameEntered) {
  console.log("** fetchPlayer fn **");
  const PUBG_AUTH = process.env.PUBG_AUTH;
  const url = `https://api.pubg.com/shards/steam/players?filter[playerNames]=${nameEntered}`;
  const opts = {
    method: 'GET',
    headers: {
      "Authorization": `${PUBG_AUTH}`,
      "Accept": "application/vnd.api+json"
    }
  }
  return fetch(url, opts);
}

function saveFetch(data) {
  console.log("saveFetch function");
  let d = data;
  return d;
  // let meh = JSON.parse(JSON.stringify(d));
  // fs.writeFileAsync('data-state2.json', JSON.stringify(meh, null, 4), function(err) {
  //   console.log('File successfuly written!!!');
  // });
}

function saveMatches(matches) {
  // fs.writeFileSync(`${player}-${Date.now()}.json`, JSON.stringify(matches, null, 4), function(err) {
  //   console.log('File successfuly written!!!');
  // });
  console.log(matches[0].id);
  return matches[0].id;
}

function getMatches(data) {
  console.log("** GET MATCHES FN **");
  let player = data.data[0].attributes.name;
  let matchesAry = data.data[0].relationships.matches.data;
  // console.log(matchesAry);
  return matchesAry
  // saveMatches(data.data[0].attributes.name, matchesAry);
}

function fetchMatchData(id) {
  console.log("** FETCH MATCH DATA fn");
  const url = `https://api.pubg.com/shards/steam/matches/${id}`;
  console.log("U R L  :  ", url);
  const opts = {
    method: "GET",
    headers: {
      Accept: "application/vnd.api+json",
    }
  };
  return fetch(url, opts)
}

// need methods and nested commands
  // reshape full game stats objs (flatten/smaller)
  // stash rosters and ids to player object ^

  // Saving player data
    // stash top 5 games by type
    // otherwise aggregate averages/time per game type

  // saving match data
    // Match lists are only previous 14 days
    // Is the match data still accessible beyond that?
    // decisions based on that

  // Scalable needs
    // data purge every 14 days might be necessary
    // need to track # of users
    // # of commands issued, and what
    // failures / logging
    // load balancing
    // async
    // threads / workers
    // redundancy in DB / 2 different backup sources
    // costs estimates based on storage needs over time

  // Big picture
    // Website / Portal / Documentation
    // deployment - potential cluster load balancing
    // 


function saveMatchData(player, match) {
  fs.writeFileSync(`${player}-FullGameStats-${match.data.id}.json`, JSON.stringify(match, null, 4), function(err) {
    console.log('File successfuly written!!!');
  });
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
