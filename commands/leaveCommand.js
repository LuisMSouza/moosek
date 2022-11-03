////////////////// IMPORTS //////////////////////
const sendError = require("../utils/error.js");
const { EmbedBuilder, Colors } = require("discord.js");

////////////////// SOURCE CODE //////////////////
module.exports = {
  name: "leave",
  description: "Para o bot sair do chat de voz em que você está",
  usage: [process.env.PREFIX_KEY + "leave"],
  category: "user",
  timeout: 7000,
  aliases: ["lv", "sair"],

  async execute(client, message, args) {
    const voiceChannel = message.member.voice.channel;
    const serverQueue = client.queue.get(message.guild.id);

    if (!voiceChannel)
      return sendError(
        "Você precisa estar em um canal de voz!",
        message.channel
      ).then((m) => m.delete({ timeout: 10000 }));
    if (serverQueue) return;
    const bot = message.guild.members.cache.get(client.user.id);
    if (bot.voice.channel != message.member.voice.channel) {
      return sendError("O bot já está sendo utilizado!", message.channel);
    }
    try {
      await message.guild.members.me.voice.disconnect();
      let emb = new EmbedBuilder()
        .setColor(Colors.Yellow)
        .setDescription("```\nSaí do canal ;)\n```");
      message.reply({
        embeds: [emb],
      });
    } catch (e) {
      console.log(e);
    }
  },
};
