/////////////////////// IMPORTS //////////////////////////
const { MessageEmbed } = require('discord.js');
const sendError = require('../utils/error.js')

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    name: "loop",
    description: "Ativa o loop  para a fila de músicas",
    usage: [process.env.PREFIX_KEY + 'loop'],
    category: 'user',
    timeout: 7000,
    aliases: ['lp'],
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
        if (serverQueue.nigthCore) return sendError("Esta opção não pode ser ativada no modo aleatório.", message.channel);
        if (serverQueue.songLooping) return sendError("Esta opção não pode ser ativada com o loop da música ativado.", message.channel);
        if (serverQueue.songs.length === 1) return sendError("A fila de músicas só possui uma música.", message.channel)
        try {
            serverQueue.looping = !serverQueue.looping;
            return serverQueue.textChannel.send({
                embeds: [{
                    color: "#0f42dc",
                    description: `🔁 Loop da fila de músicas ${serverQueue.looping ? `**Habilitado**` : `**Desabilitado**`}`
                }]
            });
        } catch (e) {
            console.log(e);
        }
    }
}