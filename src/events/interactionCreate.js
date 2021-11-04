module.exports = async function (client, interaction) {
    if (!interaction.isCommand()) return
    await interaction.deferReply();
    if (!interaction.channelId || !interaction.guildId) return;;
    
}