/////////////////////// IMPORTS //////////////////////////
import sendError from "../utils/error.js";

/////////////////////// SOURCE CODE ///////////////////////////
export const name = "now";
export const description = "Para ver a música que está tocando no servidor";
export const usage = [process.env.PREFIX_KEY + "now"];
export const category = "user";
export const timeout = 7000;
export const aliases = ["tocando", "nowplaying"];
export async function execute(client, message, args) {
  const serverQueue = client.queue.get(message.guild.id);

  if (!serverQueue)
    return sendError(
      "Não há nenhuma música sendo reproduzida.",
      message.channel
    ).then((m) => m.delete({ timeout: 10000 }));
  message.reply({
    embeds: [
      {
        title: "Tocando agora:",
        color: "YELLOW",
        description: `**${serverQueue.songs[0].title}**`,
      },
    ],
  });
}
