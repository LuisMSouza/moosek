/////////////////////// IMPORTS //////////////////////////
import { MessageEmbed } from "discord.js";
import sendError from "../utils/error.js";

/////////////////////// SOURCE CODE ///////////////////////////
export const name = "remove";
export const description =
  "Para remover uma música específica na fila do servidor";
export const options = [
  {
    name: "position",
    type: 4,
    description: "Posição da música na fila",
    required: true,
  },
];
export const usage = [
  process.env.PREFIX_KEY + "remove [número da música na fila]",
];
export const category = "user";
export const timeout = 7000;
export const aliases = ["rm", "rv", "remover"];
export async function execute(client, message, args) {
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
  const serverQueue = client.queue.get(message.guild.id);
  if (!serverQueue)
    return sendError(
      "Não há nenhuma música sendo reproduzida.",
      message.channel
    ).then((m) => m.delete({ timeout: 10000 }));
  if (serverQueue.voiceChannel.id !== message.member.voice.channel.id) {
    serverQueue.textChannel.send({
      embeds: [
        {
          color: "RED",
          description: "❌ **O bot está sendo utilizado em outro canal!**",
        },
      ],
    });
    return;
  }
  if (!args[0] && !query)
    return message.reply({
      embeds: [
        {
          description: `**Utilize**: \`${process.env.PREFIX_KEY}remove [número da música na fila]\``,
          color: "YELLOW",
        },
      ],
    });
  if (isNaN(query) && isNaN(args[0]))
    return message.reply({
      embeds: [
        {
          description: `**Utilize**: \`${process.env.PREFIX_KEY}remove [número da música na fila]\``,
          color: "YELLOW",
        },
      ],
    });
  if (serverQueue.songs.length == 1)
    return sendError("Não há uma fila de músicas.", message.channel).catch(
      console.error
    );
  if (args[0] > serverQueue.songs.length || query > serverQueue.songs.length)
    return sendError(
      `A fila tem somente ${serverQueue.songs.length} músicas!`,
      message.channel
    ).catch(console.error);
  try {
    const song = serverQueue.songs.splice((args[0] || query) - 1, 1);
    let embed = new MessageEmbed()
      .setColor("YELLOW")
      .setDescription(`❌ **${song[0].title}** removida da fila.`)
      .setFooter(
        `Removido por ${message.member.user.tag}`,
        message.member.user.displayAvatarURL()
      );

    message.reply({ embeds: [embed] });
  } catch (error) {
    return sendError(`Ocorreu um erro. Type: ${error}`, message.channel);
  }
}
