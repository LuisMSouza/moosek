/////////////////////// IMPORTS //////////////////////////
const Discord = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');

/////////////////////// ENGINE CONFIG //////////////////////////
dotenv.config();
const client = new Discord.Client();
const configVars = {
    token: process.env.TOKEN_KEY,
    prefix: process.env.PREFIX_KEY,
    genius_api: process.env.GENIUS_API_KEY,
}
client.commands = new Discord.Collection();
client.queue = new Map();
client.timeout = new Discord.Collection();

const commands = fs.readdirSync(`./commands`).filter(file => file.endsWith(".js"));
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

client.login(configVars.token);