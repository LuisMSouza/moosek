/////////////////////// IMPORTS //////////////////////////
import sendError from "../utils/error.js";

/////////////////////// SOURCE CODE ///////////////////////////
export const name = "aleatory";
export const description = "Ativa o modo aleatório para a fila de músicas";
export const usage = [process.env.PREFIX_KEY + "aleatory"];
export const category = "user";
export const timeout = 7000;
export const aliases = ["random", "rd"];
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
    serverQueue.nigthCore = !serverQueue.nigthCore;
    //if (serverQueue.looping) return sendError("Desative o Loop da fila de músicas primeiro ;)", message.channel);
    return message.reply({
      embeds: [
        {
          color: "YELLOW",
          description: `🔀 Modo aleatório ${
            serverQueue.nigthCore ? `**Habilitado**` : `**Desabilitado**`
          }`,
        },
      ],
    });
  } catch (e) {
    console.log(e);
  }
}
