module.exports = async function (client, interaction) {
    if (!interaction.channelId || !interaction.guildId) return;;
    if (!interaction.isCommand()) return;
    if (interaction.isCommand()) {
        const command = client.slashCommands.get(interaction.commandName);
        if (command) {
            if (command.options[0].name != "none") {
                const value = interaction.options.getString(command.options[0].name);
                console.log(value)
                return command.execute(client, interaction, value);
            }
            return command.execute(client, interaction, undefined);
        }
    }
    await interaction.deferReply();
}