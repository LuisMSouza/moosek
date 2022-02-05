////////////////// IMPORTS //////////////////////
import sendError from "../utils/error.js";
import { MessageEmbed } from "discord.js";

////////////////// SOURCE CODE //////////////////
export const name = "leave";
export const description = "Para o bot sair do chat de voz em que você está";
export const usage = [process.env.PREFIX_KEY + "leave"];
export const category = "user";
export const timeout = 7000;
export const aliases = ["lv", "sair"];
export async function execute(client, message, args) {
  const voiceChannel = message.member.voice.channel;
  const serverQueue = client.queue.get(message.guild.id);

  if (!voiceChannel)
    return sendError(
      "Você precisa estar em um canal de voz para iniciar uma música!",
      message.channel
    ).then((m) => m.delete({ timeout: 10000 }));
  if (serverQueue) return;
  const bot = message.guild.members.cache.get(client.user.id);
  if (bot.voice.channel != message.member.voice.channel) {
    return sendError("O bot já está sendo utilizado!", message.channel);
  }
  try {
    await message.guild.me.voice.disconnect();
    let emb = new MessageEmbed()
      .setColor("YELLOW")
      .setDescription(`**Saí do canal ;)**`);
    message.reply({
      embeds: [emb],
    });
  } catch (e) {
    console.log(e);
  }
}
