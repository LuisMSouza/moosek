/////////////////////// IMPORTS //////////////////////////
const { Client, intents, Collection } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
const { AudioPlayer } = require('@discordjs/voice');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

/////////////////////// ENGINE CONFIG //////////////////////////
dotenv.config();
const client = new Client({ intents: 32767, restTimeOffset: 0 });
const configVars = {
    token: process.env.TOKEN_KEY,
}
client.commands = new Collection();
client.queue = new Collection();
client.timeout = new Collection();
client.db = require('./utils/db.js');
client.radio = new Map();
client.player = new AudioPlayer()

const cmnds = []

const commands = fs.readdirSync(`./src/commands`).filter(file => file.endsWith(".js"));
for (const file of commands) {
    const cmd = require(`./commands/${file}`);
    cmnds.push(cmd)
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
})

const rest = new REST({
    version: "9",
}).setToken(process.env.TOKEN_KEY)

    (async () => {
        try {
            await rest.put(Routes.applicationCommand(client.user.id), {
                body: cmnds
            })
            console.log("[SOURCE] GLOBAL COMMANDS READY")
        } catch {
            await rest.put(Routes.applicationCommand(client.user.id, "677548388165615636"), {
                body: cmnds
            })
            console.log("[SOURCE] LOCAL COMMANDS READY")
        }
    })
for (const one of cmnds) {
    const data = new SlashCommandBuilder()
        .setName(one.name)
        .setDescription(one.description)
    if (one.input != null) {
        data.addStringOption(option =>
            option.setName(one.input)
                .setDescription(one.resInput)
                .setRequired(true));
    }
}

/////////////////////// SOURCE CODE //////////////////////////
client.db.init();
client.login(configVars.token);