/////////////////////// IMPORTS //////////////////////////
const { EmbedBuilder } = require("discord.js");

/////////////////////// SOURCE CODE //////////////////////////
module.exports = async (client, error) => {
  try {
    const embed = new EmbedBuilder()
      .setTitle("Erro encontrado")
      .setDescription(`**${error}**`)
      .setTimestamp(client.user.username, client.user.displayAvatarURL());

    await client.guilds.cache
      .get("731542666277290016")
      .channels.cache.get("807738719556993064")
      .send({ embeds: [embed] });
    return;
  } catch (e) {
    console.log(e);
  }
};
