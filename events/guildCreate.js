/////////////////////// IMPORTS //////////////////////////
const createGuild = require("../models/createGuild.js");
const { EmbedBuilder, Colors } = require("discord.js");

/////////////////////// SOURCE CODE //////////////////////////
module.exports = async (client, guild) => {
  try {
    const embed_1 = new EmbedBuilder()
      .setTitle("Obrigado por me adicionar!")
      .addFields(
        { name: "> ❔ __**Como usar?**__", value: "```\n" + `Para ober mais informações sobre os comandos do bot, basta digitar: ${process.env.PREFIX_KEY}ajuda\nLogo em seguida, você receberá uma mensagem contendo os comandos disponíveis.` + "\n```" }
      )
      .setTimestamp()
      .setColor(Colors.Yellow);

    if (guild.publicUpdatesChannel) {
      guild.publicUpdatesChannel.send({ embeds: [embed_1] });
    }

    const embed_2 = new EmbedBuilder()
      .setTitle("Novo servidor!")
      .setDescription(
        "```css\nNOME: " +
        `${guild.name}` +
        "\nID: " +
        `(${guild.id})` +
        "\nCEO ID: " +
        `${guild.ownerId}` +
        "\nMEMBROS: " +
        `${guild.memberCount}` +
        "\nREGIÃO: " +
        `${guild.preferredLocale}` +
        "\nV-LEVEL: " +
        `${guild.verificationLevel
        }` +
        "\n```"
      )
      .setTimestamp()
      .setFooter({ text: `Atualmente em ${client.guilds.cache.size} servidores` })
      .setThumbnail(guild.iconURL())
      .setColor(Colors.Yellow);

    client.channels.cache.get("807738719556993064").send({ embeds: [embed_2] });
    await createGuild(guild.id);
  } catch (e) {
    console.log(e);
  }
};
