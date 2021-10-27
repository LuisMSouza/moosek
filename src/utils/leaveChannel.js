const { STAY_TIME } = require('../utils/botUtils.js');
module.exports = async (client, message, song) => {
    const serverQueue = await message.client.queue.get(message.guild.id);
    const serverRadio = await message.client.radio.get(message.guild.id);
    message.client.delete(message.guild.id);
    try {
        if (serverQueue || serverRadio) {
            if (serverQueue.playing) {
                return;
            } else {
                setTimeout(async function () {
                    if (serverQueue) {
                        if (serverQueue.playing) return
                    }
                    if (!message.guild.me.voice.channel) return;
                    if (message.guild.me.voice.channel && serverQueue.songs.length >= 1) return;
                    serverQueue.nigthCore = false
                    await serverQueue.connection.disconnect();
                    serverQueue.textChannel.send({
                        embeds: [{
                            color: "#0f42dc",
                            description: `**Tempo de espera esgotado. Saí do chat ;)**`
                        }]
                    });
                    return message.client.queue.delete(message.guild.id);
                }, STAY_TIME * 1000);
            }
        } else {
            setTimeout(async function () {
                if (!message.guild.me.voice.channel) return;
                if (message.guild.me.voice.channel && serverQueue.songs.length >= 1) return;
                serverQueue.nigthCore = false
                await serverQueue.connection.disconnect();
                serverQueue.textChannel.send({
                    embeds: [{
                        color: "#0f42dc",
                        description: `**Tempo de espera esgotado. Saí do chat ;)**`
                    }]
                });
                return message.client.queue.delete(message.guild.id);
            }, STAY_TIME * 1000);
        }
    } catch (e) {
        console.log(e);
    }
    return;
}