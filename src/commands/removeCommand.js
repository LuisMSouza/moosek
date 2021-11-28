/////////////////////// IMPORTS //////////////////////////
const { MessageEmbed } = require('discord.js');
const sendError = require('../utils/error.js')

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    name: "remover",
    description: "Para remover uma música específica na fila do servidor",
    options: [
        {
            name: 'position',
            type: 4, // 'INTEGER' Type
            description: 'Posição da música na fila',
            required: true,
        }
    ],
    usage: [process.env.PREFIX_KEY + 'remover [número da música na fila]'],
    category: 'user',
    timeout: 7000,
    aliases: ['rm', 'rv', 'remove'],

    async execute(client, message, args) {
        var query;
        if (message.options) {
            query = message.options.get('position') ? message.options.get('position').value : args[0];
        }
        const serverQueue = client.queue.get(message.guild.id);
        if (!serverQueue) return sendError("Não há nenhuma música sendo reproduzida.", message.channel).then(m => m.delete({ timeout: 10000 }));
        if (serverQueue.voiceChannel.id !== message.member.voice.channel.id) {
            serverQueue.textChannel.send({
                embeds: [{
                    color: "RED",
                    description: "❌ **O bot está sendo utilizado em outro canal!**"
                }]
            })
            return;
        }
        if (!args[0] && !query) return message.reply({
            embeds: [
                {
                    description: `**Utilize**: \`${process.env.PREFIX_KEY}remove [número da música na fila]\``,
                    color: "YELLOW"
                }
            ]
        })
        if (isNaN(query) && isNaN(args[0])) return message.reply({
            embeds: [
                {
                    description: `**Utilize**: \`${process.env.PREFIX_KEY}remove [número da música na fila]\``,
                    color: "YELLOW"
                }
            ]
        })
        if (serverQueue.songs.length == 1) return sendError("Não há uma fila de músicas.", message.channel).catch(console.error);
        if (args[0] > serverQueue.songs.length || query > serverQueue.songs.length)
            return sendError(`A fila tem somente ${serverQueue.songs.length} músicas!`, message.channel).catch(console.error);
        try {
            const song = serverQueue.songs.splice((args[0] || query) - 1, 1);
            let embed = new MessageEmbed()
                .setColor("YELLOW")
                .setDescription(`❌ **${song[0].title}** removida da fila.`)
                .setFooter(`Removido por ${message.author.tag}`, message.author.displayAvatarURL())

            message.reply({ embeds: [embed] })
            message.react("✅")
        } catch (error) {
            return sendError(`Ocorreu um erro.\nType: ${error}`, message.channel);
        }
    }
}