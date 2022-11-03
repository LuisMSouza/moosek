/////////////////////// IMPORTS //////////////////////////
const sendError = require("../utils/error.js");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Colors, ButtonStyle } = require("discord.js");
const guildData = require("../models/guildData.js");

/////////////////////// SOURCE CODE //////////////////////////
module.exports = {
  name: "config",
  description: "Configura o bot no servidor",
  usage: [process.env.PREFIX_KEY + "config"],
  category: "user",
  timeout: 7000,
  aliases: ["configurar", "cfg"],

  async execute(client, message, args) {
    if (!message.member.permissions.has("ADMINISTRATOR"))
      return sendError(
        "Você não pode utilizar este comando nesse servidor",
        message.channel
      );
    const confs = await guildData.findOne({
      guildID: message.guild.id,
    });
    const pref = confs.guildPrefix;

    if (!args[0]) {
      const emb = new EmbedBuilder()
        .setTitle(`${message.guild.name} | Configuração Moosek`)
        .setThumbnail(message.guild.iconURL())
        .setColor(Colors.Yellow)
        .addFields([
          { name: '> __**Prefixo**__', value: `Prefixo atual do servidor: ` + "`" + `${pref}` + "`", inline: true },
          { name: '> __**Como alterar?**__', value: `Basta digitar ` + "`" + `${pref}config prefix` + "` ou clicar no botão abaixo", inline: true }
        ])

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("ALTERAR PREFIXO")
          .setStyle(ButtonStyle.Primary)
          .setCustomId("prefix_button")
      );

      const embdd = new EmbedBuilder().setDescription(
        "```fix\nDigite o novo prefixo\n```"
      );

      const btnMsg = await message.reply({ components: [row], embeds: [emb] });
    } else if (args[0].toLowerCase() != ("prefix" || "prefixo" || "pref")) {
      return sendError(
        `Para modificar a configuração, utilize o comando da seguinte forma: ${pref}config prefix`,
        message.channel
      );
    } else if (args[0].toLowerCase() === ("prefix" || "prefixo" || "pref")) {
      const filter = (m) => m.author.id === message.author.id;
      var msg = await message.channel.send({
        embed: { description: "```fix\nigite o novo prefixo\n```" },
      });
      message.channel
        .awaitMessages(filter, { max: 1, time: 300_000, errors: ["time"] })
        .then(async (collected) => {
          if (collected.first().content.length >= 5)
            return sendError("Esse prefixo é muito longo!", message.channel);
          collected.first().content.toLowerCase();
          await guildData.findOneAndUpdate(
            { guildID: message.guild.id },
            {
              $set: { guildPrefix: collected.first().content.toLowerCase() },
            },
            { new: true }
          );
          msg.delete(msg);
          let embdv = new EmbedBuilder()
            .setDescription(
              "Prefixo alterado para: `" +
              `${collected.first().content.toLowerCase()}` +
              "`"
            )
            .setColor(Colors.Yellow);
          message.channel.send({
            embeds: [embdv],
          });
        })
        .catch(
          (collected) =>
            message.channel.send("Tempo de resposta esgotado") &&
            console.log(collected)
        );
    }
  },
};
