module.exports = async function (client, interaction) {
    if (!interaction.channelId || !interaction.guildId) return;
    const args = [];
    const command = client.commands.get(interaction.commandName.toLowerCase());
    if (interaction.isCommand()) {
        try {
            command.execute(client, interaction, args);
        } catch (error) {
            console.error(error);
            interaction.followUp({
                content: "OPS...\n\nOCCOREU UM ERRO AO EXECUTAR ESSE COMANDO.",
            });
        }
    }
}