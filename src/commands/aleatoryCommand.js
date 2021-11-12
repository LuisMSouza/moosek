/////////////////////// IMPORTS //////////////////////////
const { MessageEmbed } = require('discord.js');
const sendError = require('../utils/error.js')

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    name: "aleatory",
    description: "Ativa o modo aleatório para a fila de músicas",
    usage: [process.env.PREFIX_KEY + 'loop'],
    category: 'user',
    timeout: 7000,
    aliases: ['radom', 'rd'],
    options: [{
        name: "none",
        description: "NONE",
        type: 3,
        required: true
    }],

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
            serverQueue.nigthCore = !serverQueue.nigthCore
            //if (serverQueue.looping) return sendError("Desative o Loop da fila de músicas primeiro ;)", message.channel);
            return serverQueue.textChannel.send({
                embeds: [{
                    color: "#2592b0",
                    description: `🔀 Modo aleatório ${serverQueue.nigthCore ? `**Habilitado**` : `**Desabilitado**`}`
                }]
            });
        } catch (e) {
            console.log(e);
        }
    }
}