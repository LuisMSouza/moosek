const { InteractionType } = require("discord.js");

module.exports = async function (client, interaction) {
  if (!interaction.channelId || !interaction.guildId) return;
  if (interaction.type === InteractionType.ApplicationCommand) {
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
  if (interaction.type === InteractionType.MessageComponent) {
    if (interaction.isSelectMenu()) return;
    const button = client.buttons.get(interaction.customId.toLowerCase());
    try {
      button.execute(client, interaction);
    } catch (error) {
      console.error(error);
      interaction.followUp({
        content: "OPS...\n\nOCCOREU UM ERRO AO EXECUTAR ESSE BOTÃO.",
      });
    }
  }
};
