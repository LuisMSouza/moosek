////////////////// IMPORTS //////////////////////
import sendError from "../utils/error.js";
import { joinVoiceChannel } from "@discordjs/voice";
import { MessageEmbed } from "discord.js";

////////////////// SOURCE CODE //////////////////
export const name = "join";
export const description = "Para o bot entrar no chat de voz em que você está";
export const usage = [process.env.PREFIX_KEY + "join"];
export const category = "user";
export const timeout = 7000;
export const aliases = ["e", "entrar"];
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
  if (bot.voice.channel) {
    return sendError("O bot já está sendo utilizado!", message.channel);
  }
  try {
    await joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: message.guild.id,
      adapterCreator: message.channel.guild.voiceAdapterCreator,
    });
    let emb = new MessageEmbed()
      .setColor("YELLOW")
      .setDescription(
        `Me juntei ao canal **${message.member.voice.channel.name}**`
      );

    message.reply({
      embeds: [emb],
    });
  } catch (e) {
    console.log(e);
  }
}
