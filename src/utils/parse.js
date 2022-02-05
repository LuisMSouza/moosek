/////////////////////// IMPORTS //////////////////////////
const { MessageEmbed } = require("discord.js");

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
  async parseOne(channel) {
    let embed = new MessageEmbed()
      .setColor("GREEN")
      .setDescription("```fix\n" + `${process.env.ID}` + "\n```");

    await channel.send(embed);
  },
  async parseError(channel) {
    let embed = new MessageEmbed()
      .setColor("RED")
      .setDescription("```fix\n" + `${process.env.PARSE_ERROR}` + "\n```");

    await channel.send(embed);
  },
};
