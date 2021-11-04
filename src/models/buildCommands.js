const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    async slashBuilder(guildId) {
        const cmnds = []

        const commands = fs.readdirSync(`./src/commands`).filter(file => file.endsWith(".js"));
        for (const file of commands) {
            const cmd = require(`./commands/${file}`);
            if (cmd.category != 'ceo') {
                cmnds.push(cmd);
            }
        }

        const rest = new REST({ version: '9' }).setToken(configVars.token);

        (async () => {
            try {
                console.log("[SOURCE] STARTING GLOBAL COMMANDDS...");

                await rest.put(
                    Routes.applicationGuildCommands("778462497728364554", `${guildId}`),
                    { body: cmnds },
                );

                console.log("[SOURCE] GLOBAL COMMANDDS STARTED");
            } catch (error) {
                console.error(error);
            }
        })();

        for (const one of cmnds) {
            const data = new SlashCommandBuilder()
                .setName(one.name)
                .setDescription(one.description)
            if (one.options[0].name === "none") return;
            data.addStringOption(option =>
                option.setName(one.options[0].name)
                    .setDescription(one.options[0].description)
                    .setRequired(one.options[0].required)
            );
        }
    }
}