/////////////////////// IMPORTS //////////////////////////
const { Client, Collection } = require("discord.js");
const dotenv = require("dotenv");
const { readdirSync, readdir } = require("fs");
const { AudioPlayer } = require("@discordjs/voice");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

/////////////////////// ENGINE CONFIG //////////////////////////
dotenv.config();
const client = new Client({ intents: 32767, restTimeOffset: 0 });
const configVars = {
  token: process.env.TOKEN_KEY,
};
client.commands = new Collection();
client.queue = new Collection();
client.timeout = new Collection();
client.db = require("./utils/db.js");
client.radio = new Map();
client.player = new AudioPlayer();
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

const rest = new REST({ version: "9" }).setToken(configVars.token);

(async () => {
  try {
    console.log("[SOURCE] STARTING GLOBAL COMMANDDS...");

    await rest.put(Routes.applicationCommands("778462497728364554"), {
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
