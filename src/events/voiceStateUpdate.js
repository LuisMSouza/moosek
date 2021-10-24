module.exports = async function (client, oldState, newState) {
    const serverQueue = newState.client.queue.get(newState.guild.id);
    if (newState.channelId && newState.channel.type === 'GUILD_STAGE_VOICE' && newState.guild.me.voice.suppress) {
        try {
            await newState.guild.me.voice.setSuppressed(false);
        } catch (e) {
            return console.log(e);
        }
    }
    if (newState.member.id === bot.user.id && !newState.connection) {
        if (serverQueue) return;
        bot.queue.delete(newState.guild.id);
    }
}