/////////////////////// IMPORTS //////////////////////////
const { EmbedBuilder, Colors } = require("discord.js");

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = async (text, channel) => {
  const embed = new EmbedBuilder()
    .setDescription("```\n" + `❌ - ${text}` + "\n```")
    .setColor(Colors.Yellow)
    .setTimestamp()
  await channel.send({ embeds: [embed] });
};
