/////////////////////// IMPORTS //////////////////////////
const sendError = require('../utils/error.js');
const Player = require('../structures/createPlayer.js');

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    name: "skipto",
    description: "Para pular para uma música específica na fila do servidor",
    usage: [process.env.PREFIX_KEY + 'skipto [número da música na fila]'],
    category: 'user',
    timeout: 7000,
    aliases: ['st', 'nt', 'nextto'],
    options: [{
        name: "posição",
        description: "POSIÇÃO DA MÚSICA NA FILA",
        type: 3,
        required: true
    }],
    
    async execute(client, message, args) {
        if (!args.length || isNaN(args[0]))
            return message.channel.send({
                embeds: [
                    {
                        description: `**Utilize**: \`${process.env.PREFIX_KEY}skipto [número da música na fila]\``
                    }
                ]
            }).catch(console.error);

        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue) return sendError("Não há nenhuma música sendo reproduzida.", message.channel).catch(console.error);
        if (args[0] > serverQueue.songs.length)
            return sendError(`A fila tem somente ${serverQueue.songs.length} músicas!`, message.channel).catch(console.error);

        serverQueue.playing = true;

        if (serverQueue.looping) {
            for (let i = 0; i < args[0] - 2; i++) {
                serverQueue.songs.push(serverQueue.songs.shift());
            }
        } else {
            serverQueue.songs = serverQueue.songs.slice(args[0] - 2);
        }
        try {
            Player.play(client, message, serverQueue.songs[0]);
            message.channel.send({
                embeds: [
                    {
                        color: "#0f42dc",
                        description: `⏭ \`${args[0] - 1}\` músicas puladas por ${message.author}`
                    }
                ]

            }).catch(console.error);
            message.react("✅")
        } catch (error) {
            await message.guild.me.voice.disconnect();
            message.client.queue.delete(message.guild.id);
            return sendError(`As músicas foram paradas e a fila de músicas foi apagada.: ${error}`, message.channel);
        }
    }
}