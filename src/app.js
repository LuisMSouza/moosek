/////////////////////// IMPORTS //////////////////////////
const { Client, intents, Collection } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
const { AudioPlayer } = require('@discordjs/voice');

/////////////////////// ENGINE CONFIG //////////////////////////
dotenv.config();
const client = new Client({ intents: 32767, queue: new Map() });
const configVars = {
    token: process.env.TOKEN_KEY,
}
client.commands = new Collection();
//client.queue = new Map();
client.timeout = new Collection();
client.db = require('./utils/db.js');
client.radio = new Map();
client.player = new AudioPlayer()

const commands = fs.readdirSync(`./src/commands`).filter(file => file.endsWith(".js"));
for (const file of commands) {
    const cmd = require(`./commands/${file}`);
    client.commands.set(cmd.name, cmd);
    console.log("Carregando comando: " + cmd.name)
}

fs.readdir(__dirname + "/events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
        const event = require(__dirname + `/events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
        console.log("Carregando evento: " + eventName)
    });
});

/////////////////////// SOURCE CODE //////////////////////////
client.db.init();
client.login(configVars.token);