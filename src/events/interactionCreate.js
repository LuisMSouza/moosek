module.exports = async function (client, interaction) {
    if (!interaction.channelId || !interaction.guildId) return;;
    if (interaction.isCommand()) {
        const command = client.slashCommands.get(interaction.commandName);
        if (command) {
            const value = interaction.options.getString(command.options[0].name);
            return command.execute(client, interaction, value);
        }
    }
    await interaction.deferReply();
}