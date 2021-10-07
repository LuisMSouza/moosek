/////////////////////// IMPORTS //////////////////////////
const Discord = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');

/////////////////////// ENGINE CONFIG //////////////////////////
dotenv.config();
const client = new Discord.Client({
    allowedMentions: {
        parse: ['users', 'roles'],
        repliedUser: true
    },
    restTimeOffset: 0,
    shards: "auto",
    intents: Discord.Intents.ALL
})
const configVars = {
    token: process.env.TOKEN_KEY,
}
client.commands = new Discord.Collection();
client.queue = new Map();
client.timeout = new Discord.Collection();
client.db = require('./utils/db.js');
client.radio = new Map();

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