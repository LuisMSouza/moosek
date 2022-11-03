/////////////////////// IMPORTS //////////////////////////
const sendError = require("../utils/error.js");
const { Colors } = require("discord.js");

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
  name: "aleatory",
  description: "Ativa o modo aleatório para a fila de músicas",
  usage: [process.env.PREFIX_KEY + "aleatory"],
  category: "user",
  timeout: 7000,
  aliases: ["random", "rd"],

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
      });
      return;
    }
    if (!serverQueue)
      return sendError(
        "Nenhuma música sendo reproduzida no momento...",
        serverQueue.textChannel
      );
    try {
      serverQueue.nigthCore = !serverQueue.nigthCore;
      //if (serverQueue.looping) return sendError("Desative o Loop da fila de músicas primeiro ;)", message.channel);
      return message.reply({
        embeds: [
          {
            color: Colors.Yellow,
            description: "```\n" + `🔀 Modo aleatório ${serverQueue.nigthCore ? `Habilitado` : `Desabilitado` + "\n```"
              }`,
          },
        ],
      });
    } catch (e) {
      console.log(e);
    }
  },
};
