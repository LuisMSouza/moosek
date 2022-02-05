export default async function (client, interaction) {
    if (!interaction.channelId || !interaction.guildId) return;
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName.toLowerCase());
        try {
            command.execute(client, interaction, interaction.options);
        } catch (error) {
            console.error(error);
            interaction.followUp({
                content: "OPS...\n\nOCCOREU UM ERRO AO EXECUTAR ESSE COMANDO.",
            });
        }
    }
}