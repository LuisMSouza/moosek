/////////////////////// IMPORTS //////////////////////////
const { MessageEmbed } = require('discord.js');
const sendError = require('../utils/error.js')

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    name: "repetir",
    description: "Ativa a repetição para a música atual",
    usage: [process.env.PREFIX_KEY + 'repetir'],
    category: 'user',
    timeout: 7000,
    aliases: ['rp', 'rpt', 'repeat'],


    async execute(client, message, args) {
        const serverQueue = client.queue.get(message.guild.id);
        if (!message.member.voice.channel) {
            message.reply({
                embeds: [{
                    color: "RED",
                    description: "❌ **Você precisa estar em um canal de voz.**"
                }]
            })
            return;
        }
        if (serverQueue.voiceChannel.id !== message.member.voice.channel.id) {
            message.reply({
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
            return message.reply({
                embeds: [{
                    color: "YELLOW",
                    description: `🔂 Loop para \`${serverQueue.songs[0].title}\` ${serverQueue.songLooping ? `**Habilitado**` : `**Desabilitado**`}`
                }]
            });
        } catch (e) {
            console.log(e);
        }
    }
}