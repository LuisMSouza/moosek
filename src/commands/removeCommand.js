/////////////////////// IMPORTS //////////////////////////
const { MessageEmbed } = require('discord.js');
const sendError = require('../utils/error.js')

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    name: "remover",
    description: "Para remover uma música específica na fila do servidor",
    usage: [process.env.PREFIX_KEY + 'remover [número da música na fila]'],
    category: 'user',
    timeout: 7000,
    aliases: ['rm', 'rv', 'remove'],
    options: [{
        name: "posição",
        description: "POSIÇÃO DA MÚSICA NA FILA",
        type: "STRING",
        required: true
    }],

    async execute(client, message, args) {
        if (args === undefined) args === null
        const serverQueue = client.queue.get(message.guild.id);

        if (!serverQueue) return sendError("Não há nenhuma música sendo reproduzida.", message.channel).then(m => m.delete({ timeout: 10000 }));
        if (!args.length) return message.channel.send({
            embeds: [
                {
                    description: `**Utilize**: \`${process.env.PREFIX_KEY}remove [número da música na fila]\``
                }
            ]
        })
        if (isNaN(args[0])) return message.channel.send({
            embeds: [
                {
                    description: `**Utilize**: \`${process.env.PREFIX_KEY}remove [número da música na fila]\``
                }
            ]
        })
        if (serverQueue.songs.length == 1) return sendError("Não há uma fila de músicas.", message.channel).catch(console.error);
        if (args[0] > serverQueue.songs.length)
            return sendError(`A fila tem somente ${serverQueue.songs.length} músicas!`, message.channel).catch(console.error);
        try {
            const song = serverQueue.songs.splice(args[0] - 1, 1);
            let embed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ **${song[0].title}** removida da fila.`)
                .setFooter(`Removido por ${message.author.tag}`, message.author.displayAvatarURL())

            message.channel.send({ embeds: [embed] })
            message.react("✅")
        } catch (error) {
            return sendError(`Ocorreu um erro.\nType: ${error}`, message.channel);
        }
    }
}