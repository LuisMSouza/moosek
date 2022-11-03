/////////////////////// IMPORTS //////////////////////////
const sendError = require("../utils/error.js");
const { Colors } = require("discord.js");

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
  name: "repeat",
  description: "Ativa a repetição para a música atual",
  usage: [process.env.PREFIX_KEY + "repeat"],
  category: "user",
  timeout: 7000,
  aliases: ["rp", "rpt", "repetir"],

  async execute(client, message, args) {
    const serverQueue = client.queue.get(message.guild.id);
    if (!message.member.voice.channel) {
      message.reply({
        embeds: [
          {
            color: Colors.Red,
            description: "```\n❌ - Você precisa estar em um canal de voz.\n```",
          },
        ],
        ephemeral: true
      });
      return;
    }
    if (serverQueue.voiceChannel.id !== message.member.voice.channel.id) {
      message.reply({
        embeds: [
          {
            color: Colors.Red,
            description: "```\n❌ - O bot está sendo utilizado em outro canal!\n```",
          },
        ],
        ephemeral: true
      });
      return;
    }
    if (!serverQueue)
      return message.reply({
        embeds: [
          {
            color: Colors.Yellow,
            description: "```\n❌ - Não há nenhuma música sendo reproduzida no momento.\n```"
          },
        ],
        ephemeral: true
      });
    try {
      serverQueue.songLooping = !serverQueue.songLooping;
      return message.reply({
        embeds: [
          {
            color: Colors.Yellow,
            description: "```\n" + `🔂 Loop para ${serverQueue.songs[0].title} ${serverQueue.songLooping ? `Habilitado` : `Desabilitado`
              }` + "\n```",
          },
        ],
      });
    } catch (e) {
      console.log(e);
    }
  },
};
