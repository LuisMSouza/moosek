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

        const volume = Number(args.join(" "));

        if (volume) return message.channel.send({
            embed: {
                description: `O volume atual do servidor é: **${serverQueue.volume}**`
            }
        });
        if (isNaN(volume) || volume < 0 || volume > 150) {
            return sendError("Você deve forncecer um valor de **0** a **5**")
        }

        serverQueue.volume = volume;
        serverQueue.connection.dispatcher.setVolumeLogarithmic(volume / 100)
        message.channel.send({
            embed: {
                description: `Volume alterado para: **${volume}/5**`
            }
        })
        return undefined;
    }
}