const { STAY_TIME } = require('../utils/botUtils.js');
module.exports = async (client, message, song) => {
    const serverQueue = await message.client.queue.get(message.guild.id);
    const serverRadio = await message.client.radio.get(message.guild.id);
    const bot = message.guild.members.cache.get(client.user.id);
    if (bot.voice.speaking) return;
    if (serverQueue.connection.dispatcher && message.guild.me.voice.channel) return;
    if (!message.guild.me.voice.channel) return;
    if (message.guild.me.voice.channel && serverQueue.songs.length >= 1) return;
    if (serverRadio) return;
    message.client.queue.delete(message.guild.id);
    if (bot.voice.speaking) return
    setTimeout(async function () {
        if (bot.voice.speaking) return;
        if (serverQueue.connection.dispatcher && message.guild.me.voice.channel) return;
        if (!message.guild.me.voice.channel) return;
        if (message.guild.me.voice.channel && serverQueue.songs.length >= 1) return;
        serverQueue.nigthCore = false
        await serverQueue.voiceChannel.leave();
        serverQueue.textChannel.send({
            embed: {
                color: "#0f42dc",
                description: `**Tempo de espera esgotado. Saí do chat ;)**`
            }
        });
        return message.client.queue.delete(message.guild.id);
    }, STAY_TIME * 1000);
    return;
}