/////////////////////// IMPORTS //////////////////////////
const { MessageEmbed } = require('discord.js');
const sendError = require('../utils/error.js')

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    name: "repeat",
    description: "Ativa o loop  para a música atual",
    usage: [process.env.PREFIX_KEY + 'repeat'],
    category: 'user',
    timeout: 7000,
    aliases: ['rp', 'rpt', 'repetir'],
    input: null,
    resInput: null,

    async execute(client, message, args) {
        var membReact = message.guild.members.cache.get(message.author.id);
        const serverQueue = client.queue.get(message.guild.id);
        if (!message.member.voice.channel) {
            serverQueue.textChannel.send({
                embeds: [{
                    color: "RED",
                    description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                }]
            })
            return;
        }
        if (serverQueue.voiceChannel.id !== membReact.voice.channel.id) {
            serverQueue.textChannel.send({
                embeds: [{
                    color: "RED",
                    description: "❌ **O bot está sendo utilizado em outro canal!**"
                }]
            })
            return;
        }
        if (!serverQueue) return sendError("Nenhuma música sendo reproduzida no momento...", serverQueue.textChannel);
        try {
            serverQueue.songLooping = !serverQueue.songLooping
            return serverQueue.textChannel.send({
                embeds: [{
                    color: "#0f42dc",
                    description: `🔂 Loop para \`${serverQueue.songs[0].title}\` ${serverQueue.songLooping ? `**Habilitado**` : `**Desabilitado**`}`
                }]
            });
        } catch (e) {
            console.log(e);
        }
    }
}