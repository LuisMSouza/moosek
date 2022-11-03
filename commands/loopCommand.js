/////////////////////// IMPORTS //////////////////////////
const sendError = require("../utils/error.js");
const { Colors } = require("discord.js");

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
  name: "loop",
  description: "Ativa o loop  para a fila de músicas",
  usage: [process.env.PREFIX_KEY + "loop"],
  category: "user",
  timeout: 7000,
  aliases: ["lp"],

  async execute(client, message, args) {
    const serverQueue = client.queue.get(message.guild.id);
    if (!message.member.voice.channel) {
      serverQueue.textChannel.send({
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
      serverQueue.textChannel.send({
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
            color: Colors.Red,
            description: "```\n❌ - Não há fila de músicas!\n```",
          },
        ],
        ephemeral: true
      })
    if (serverQueue.nigthCore)
      return message.reply({
        embeds: [
          {
            color: Colors.Red,
            description: "```\n❌ - Esta opção não pode ser ativada com o modo aleatório ativado!\n```",
          },
        ],
        ephemeral: true
      });
    if (serverQueue.songLooping)
      return message.reply({
        embeds: [
          {
            color: Colors.Red,
            description: "```\n❌ - Essa opção não pode ser ativada com o loop da música ativado!\n```",
          },
        ],
        ephemeral: true
      });
    if (serverQueue.songs.length === 1)
      return message.reply({
        embeds: [
          {
            color: Colors.Red,
            description: "```\n❌ - A fila de músicas só possui uma música!\n```",
          },
        ],
        ephemeral: true
      });
    try {
      serverQueue.looping = !serverQueue.looping;
      return message.reply({
        embeds: [
          {
            color: Colors.Yellow,
            description: "```\n" + `🔁 Loop da fila de músicas ${serverQueue.looping ? `Habilitado` : `Desabilitado`
              }` + "\n```",
          },
        ],
      });
    } catch (e) {
      console.log(e);
    }
  },
};
