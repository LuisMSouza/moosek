export default async function (client, oldState, newState) {
    const serverQueue = newState.client.queue.get(newState.guild.id);
    if (newState.channelId && newState.channel.type === 'GUILD_STAGE_VOICE' && newState.guild.me.voice.suppress) {
        try {
            await newState.guild.me.voice.setSuppressed(false);
        } catch (e) {
            return console.log(e);
        }
    }
    if (!newState.guild.me.voice.channelId) {
        client.queue.delete(newState.guild.id);
    }
}