/////////////////////// IMPORTS //////////////////////////
const sendError = require("../utils/error.js");
const Player = require("../structures/createPlayer.js");
const { ApplicationCommandOptionType, Colors } = require("discord.js");

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
  name: "skipto",
  description: "Para pular para uma música específica na fila do servidor",
  options: [
    {
      name: "position",
      type: ApplicationCommandOptionType.Integer, // 'INTEGER' Type
      description: "Posição da música para ser pulada",
      required: true,
    },
  ],
  usage: [process.env.PREFIX_KEY + "skipto [número da música na fila]"],
  category: "user",
  timeout: 7000,
  aliases: ["st", "nt", "nextto", "skipto"],

  async execute(client, message, args) {
    var query;
    try {
      if (args) {
        query = args.get("position")
          ? args.get("position").value
          : null || args.join(" ");
      }
    } catch (e) {
      if (
        e.message.includes("Cannot read properties of null (reading 'value')")
      ) {
        query = null;
      }
    }
    if ((!args.length && !query) || (isNaN(args[0]) && !query)) {
      return message
        .reply({
          embeds: [
            {
              color: Colors.Yellow,
              description: "```\n" + `Utilize: ${process.env.PREFIX_KEY}skipto [número da música na fila]` + "\n```",
            },
          ],
          ephemeral: true
        })
        .catch(console.error);
    }

    const serverQueue = client.queue.get(message.guild.id);
    if (!serverQueue)
      return message.reply({
        embeds: [
          {
            color: Colors.Red,
            description: "```\n❌ - Não há nenhuma música sendo reproduzida no momento.\n```",
          },
        ],
        ephemeral: true
      })
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
    if (args[0] > serverQueue.songs.length || query > serverQueue.songs.length)
      return sendError(
        `A fila tem somente ${serverQueue.songs.length} músicas!`,
        message.channel
      ).catch(console.error);

    serverQueue.playing = true;

    if (serverQueue.looping) {
      for (let i = 0; i < (args[0] || query) - 2; i++) {
        serverQueue.songs.push(serverQueue.songs.shift());
      }
    } else {
      serverQueue.songs = serverQueue.songs.slice((args[0] || query) - 1);
    }
    try {
      await Player.play(client, message, serverQueue.songs[0]);
      message
        .reply({
          embeds: [
            {
              color: Colors.Yellow,
              description: "```\n" + `⏭ \`${(args[0] || query) - 1
                }\` músicas puladas por ${message.member.user.username}` + "\n```"
            },
          ],
        })
        .catch(console.error);
    } catch (error) {
      await message.guild.me.voice.disconnect();
      message.client.queue.delete(message.guild.id);
      return sendError(
        `As músicas foram paradas e a fila de músicas foi apagada.: ${error}`,
        message.channel
      );
    }
  },
};
