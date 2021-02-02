/////////////////////// IMPORTS //////////////////////////
const { MessageEmbed, Util } = require('discord.js');
const sendError = require('../utils/error.js')

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    name: "volume",
    description: "Para alterar o volume das músicas do servidor",
    usage: [process.env.PREFIX_KEY + 'volume [volume de 1 a 5]'],
    timeout: 7000,
    aliases: ['v', 'vol'],

    async execute(client, message, args) {
        const serverQueue = client.queue.get(message.guild.id);

        if (!message.member.voice.channel) return sendError("Você precisa estar em um canal de voz para alterar o volume das músicas!", message.channel).then(m => m.delete({ timeout: 10000 }));
        if (!serverQueue) return sendError("Não há nenhuma música sendo reproduzida.", message.channel).then(m2 => m2.delete({ timeout: 10000 }));

        if (!args[0]) return message.channel.send({
            embed: {
                description: `O volume atual do servidor é: **${serverQueue.volume}**`
            }
        });
        if (isNaN(args[0])) return sendError("Informe um valor válido", message.channel).then(m3 => m3.delete({ timeout: 10000 }));
        if (args[0] > 5) return sendError("Escolha um volume de **1** a **5**", message.channel).then(m4 => m4.delete({ timeout: 10000 }))

        serverQueue.volume = args[1];
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5)
        message.channel.send({
            embed: {
                description: `Volume alterado para: **${args[1]}**`
            }
        })
        return undefined;
    }
}