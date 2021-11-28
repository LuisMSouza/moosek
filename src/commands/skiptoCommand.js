/////////////////////// IMPORTS //////////////////////////
const sendError = require('../utils/error.js');
const Player = require('../structures/createPlayer.js');

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    name: "skipto",
    description: "Para pular para uma música específica na fila do servidor",
    options: [
        {
            name: 'position',
            type: 4, // 'INTEGER' Type
            description: 'Posição da música para ser pulada',
            required: true,
        }
    ],
    usage: [process.env.PREFIX_KEY + 'skipto [número da música na fila]'],
    category: 'user',
    timeout: 7000,
    aliases: ['st', 'nt', 'nextto'],

    async execute(client, message, args) {
        var query;
        if (message.options) {
            query = message.options.get('position') ? message.options.get('position').value : args[0];
        }
        if (!args.length && !query || isNaN(args[0]) && !query) {
            return message.reply({
                embeds: [
                    {
                        color: "YELLOW",
                        description: `**Utilize**: \`${process.env.PREFIX_KEY}skipto [número da música na fila]\``
                    }
                ]
            }).catch(console.error);
        }

        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue) return sendError("Não há nenhuma música sendo reproduzida.", message.channel).catch(console.error);
        if (serverQueue.voiceChannel.id !== message.member.voice.channel.id) {
            serverQueue.textChannel.send({
                embeds: [{
                    color: "RED",
                    description: "❌ **O bot está sendo utilizado em outro canal!**"
                }]
            })
            return;
        }
        if (args[0] > serverQueue.songs.length || query > serverQueue.songs.length)
            return sendError(`A fila tem somente ${serverQueue.songs.length} músicas!`, message.channel).catch(console.error);

        serverQueue.playing = true;

        if (serverQueue.looping) {
            for (let i = 0; i < (args[0] || query) - 2; i++) {
                serverQueue.songs.push(serverQueue.songs.shift());
            }
        } else {
            serverQueue.songs = serverQueue.songs.slice((args[0] || query) - 1);
        }
        try {
            Player.play(client, message, serverQueue.songs[0]);
            message.reply({
                embeds: [
                    {
                        color: "YELLOW",
                        description: `⏭ \`${(args[0] || query) - 1}\` músicas puladas por ${message.member.user.username}`
                    }
                ]

            }).catch(console.error);
        } catch (error) {
            await message.guild.me.voice.disconnect();
            message.client.queue.delete(message.guild.id);
            return sendError(`As músicas foram paradas e a fila de músicas foi apagada.: ${error}`, message.channel);
        }
    }
}