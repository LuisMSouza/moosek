/////////////////////// IMPORTS //////////////////////////
const { CEO_ID } = require("../utils/botUtils.js");
const guildData = require("../models/guildData.js");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Colors } = require("discord.js");

/////////////////////// SOURCE CODE //////////////////////////
module.exports = {
  name: "announce",
  description: "Faz um anúncio a todos os servidores em que o bot está",
  usage: [process.env.PREFIX_KEY + "announce"],
  category: "ceo",
  timeout: 7000,
  aliases: ["anc", "msgall", "msg"],

  async execute(client, message, args) {
    if (message.author.id != CEO_ID) return;

    const msg = args.join(" ") || args;
    if (!msg) return;

    const embed = new EmbedBuilder()
      .setTitle("ANÚNCIO DOS DESENVOLVEDORES")
      .setDescription(`${msg}`)
      .setColor(Colors.Yellow)
      .setFooter(
        "THE DRAGONS COMMUNITY TEAM • ALL RIGHTS RESERVED",
        "https://i.imgur.com/l59rO0X.gif"
      );

    const button = new ButtonBuilder()
      .setStyle("LINK")
      .setLabel("TDG COMMUNITY")
      .setURL("https://discord.gg/5QvAqkS7fy");

    const row = new ActionRowBuilder().addComponents(button);

    const data = await guildData.find({});
    data.forEach(async function (c) {
      try {
        const guild = c.guildID;
        const channelSystem = client.guilds.cache.get(guild);
        const channelUpdates = client.guilds.cache.get(guild);

        const cSystem = channelSystem.systemChannel;
        const cUpdates = channelUpdates.publicUpdatesChannel;
        console.log(cSystem);
        if (!cSystem && !cUpdates) return;
        if (cUpdates) {
          cUpdates.send({ components: [row], embeds: [embed] }) &&
            console.log("[CLIENT] ANÚNCIO ENVIADO");
          return;
        } else {
          cSystem.send({ components: [row], embeds: [embed] }) &&
            console.log("[CLIENT] ANÚNCIO ENVIADO");
          return;
        }
      } catch (e) {
        console.log(e);
      }
    });
  },
};
