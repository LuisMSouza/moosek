/////////////////////// IMPORTS //////////////////////////
const sendError = require("../utils/error.js");
const { Colors } = require("discord.js");

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
  name: "now",
  description: "Para ver a música que está tocando no servidor",
  usage: [process.env.PREFIX_KEY + "now"],
  category: "user",
  timeout: 7000,
  aliases: ["tocando", "nowplaying"],

  async execute(client, message, args) {
    const serverQueue = client.queue.get(message.guild.id);

    if (!serverQueue)
      return message.reply({
        embeds: [
          {
            color: Colors.Red,
            description: "```\n❌ - Não há nenhuma música sendo reproduzida!\n```",
          },
        ],
        ephemeral: true
      })
    message.reply({
      embeds: [
        {
          title: "Tocando agora:",
          color: Colors.Yellow,
          description: "```\n" + `${serverQueue.songs[0].title}` + "\n```",
        },
      ],
    });
  },
};
