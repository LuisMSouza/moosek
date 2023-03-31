/////////////////////// IMPORTS //////////////////////////
const { Client, Collection, GatewayIntentBits, Routes, REST } = require("discord.js");
const dotenv = require("dotenv");
const { readdirSync, readdir } = require("fs");
const { AudioPlayer } = require("@discordjs/voice");

/////////////////////// ENGINE CONFIG //////////////////////////
dotenv.config();
const client = new Client({
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildEmojisAndStickers,
  ]
});
const configVars = {
  token: process.env.TOKEN_KEY,
};
client.commands = new Collection();
client.buttons = new Collection();
client.queue = new Collection();
client.timeout = new Collection();
client.db = require("./utils/db.js");
client.radio = new Map();
client.player = new AudioPlayer();
client.radioPlayer = new AudioPlayer();
client.slashCommands = new Collection();

const commands = readdirSync(`./commands`).filter((file) =>
  file.endsWith(".js")
);
for (const file of commands) {
  const cmd = require(`./commands/${file}`);
  if (cmd.category != "ceo") {
    client.slashCommands.set(cmd.name, cmd);
  }
  client.commands.set(cmd.name, cmd);
}
console.log("[SOURCE] COMMANDS RELOADED");

readdir(__dirname + "/events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    const event = require(__dirname + `/events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});
console.log("[SOURCE] EVENTS RELOADED");

const buttons = readdirSync(`./buttons`).filter((file) =>
  file.endsWith(".js")
);
for (const button of buttons) {
  const bt = require(`./buttons/${button}`);
  client.buttons.set(bt.name, bt);
}
console.log("[SOURCE] BUTTONS LOADED");

const rest = new REST({ version: "10" }).setToken(configVars.token);

(async () => {
  try {
    console.log("[SOURCE] STARTING GLOBAL COMMANDDS...");

    await rest.put(Routes.applicationCommands("990724810210410526"), {
      body: client.slashCommands,
    });

    console.log("[SOURCE] GLOBAL COMMANDDS STARTED");
  } catch (error) {
    console.error(error);
  }
})();

/////////////////////// SOURCE CODE //////////////////////////
client.db.init();
client.login(configVars.token);
