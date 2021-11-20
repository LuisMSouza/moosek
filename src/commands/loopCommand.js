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

    async execute(client, message, args) {
        const serverQueue = client.queue.get(message.guild.id);
        if (!message.member.voice.channel) {
            serverQueue.textChannel.send({
                embeds: [{
                    color: "RED",
                    description: "❌ **Você precisa estar em um canal de voz.**"
                }]
            })
            return;
        }
        if (serverQueue.voiceChannel.id !== message.member.voice.channel.id) {
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
            return message.reply({
                embeds: [{
                    color: "#0184f8",
                    description: `🔁 Loop da fila de músicas ${serverQueue.looping ? `**Habilitado**` : `**Desabilitado**`}`
                }]
            });
        } catch (e) {
            console.log(e);
        }
    }
}