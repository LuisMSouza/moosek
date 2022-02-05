/////////////////////// IMPORTS //////////////////////////
import sendError from "../utils/error.js";

/////////////////////// SOURCE CODE ///////////////////////////
export const name = "repeat";
export const description = "Ativa a repetição para a música atual";
export const usage = [process.env.PREFIX_KEY + "repeat"];
export const category = "user";
export const timeout = 7000;
export const aliases = ["rp", "rpt", "repetir"];
export async function execute(client, message, args) {
  const serverQueue = client.queue.get(message.guild.id);
  if (!message.member.voice.channel) {
    message.reply({
      embeds: [
        {
          color: "RED",
          description: "❌ **Você precisa estar em um canal de voz.**",
        },
      ],
    });
    return;
  }
  if (serverQueue.voiceChannel.id !== message.member.voice.channel.id) {
    message.reply({
      embeds: [
        {
          color: "RED",
          description: "❌ **O bot está sendo utilizado em outro canal!**",
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
    serverQueue.songLooping = !serverQueue.songLooping;
    return message.reply({
      embeds: [
        {
          color: "YELLOW",
          description: `🔂 Loop para \`${serverQueue.songs[0].title}\` ${
            serverQueue.songLooping ? `**Habilitado**` : `**Desabilitado**`
          }`,
        },
      ],
    });
  } catch (e) {
    console.log(e);
  }
}
