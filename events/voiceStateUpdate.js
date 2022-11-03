const { MessageManager, ChannelType } = require("discord.js");

module.exports = async function (client, oldState, newState) {
  const serverQueue = newState.client.queue.get(newState.guild.id);
  const radioStruct = newState.client.radio.get(newState.guild.id)
  if (
    newState.channelId &&
    newState.channel.type === ChannelType.GuildStageVoice &&
    newState.guild.members.me.voice.suppress
  ) {
    try {
      await newState.guild.members.me.voice.setSuppressed(false);
    } catch (e) {
      return console.log(e);
    }
  }
  if (!newState.guild.members.me.voice.channelId) {
    if (serverQueue) {
      try {
        const msg = await serverQueue.textChannel.messages.cache.get(`${serverQueue.songs[0].messageId}`);
        if (msg) await msg.edit({ embeds: [serverQueue.songs[0].embed], components: [] });
        client.queue.delete(newState.guild.id);
      } catch (e) {
        console.log(e);
      }
    }
    if (radioStruct) {
      try {
        const msg = await radioStruct.textChannel.messages.cache.get(`${radioStruct.messageId}`);
        if (msg) await msg.edit({ embeds: [], components: [], content: "```\nBot desconectado, radio finalizada.\n```" });
        client.radio.delete(newState.guild.id);
      } catch (e) {
        console.log(e);
      }
    }
  }
};
