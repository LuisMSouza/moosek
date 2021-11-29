/////////////////////// IMPORTS ///////////////////////////
const sendError = require('../utils/error.js');
const Move = require('alib-array')

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    name: "mover",
    description: "Para mover uma música de posição na fila",
    options: [
        {
            name: 'position',
            type: 4, // 'INTEGER' Type
            description: 'Posição atual da música na fila',
            required: true,
        },
        {
            name: 'new',
            type: 4, // 'INTEGER' Type
            description: 'Posição para qual vai ser colocado',
            required: true,
        }
    ],
    usage: [process.env.PREFIX_KEY + 'mover [posição atual] [nova posição]'],
    category: 'user',
    timeout: 5000,
    aliases: ['mv', 'move'],

    async execute(client, message, args) {
        var query1;
        var query2;;
        if (message.options) {
            query1 = message.options.get('position') ? message.options.get('position').value : args[0];
            query2 = message.options.get('new') ? message.options.get('new').value : args[0];
        }
        const serverQueue = client.queue.get(message.guild.id);
        var oldPosition = args[0] || query1;
        var newPosition = args[1] || query2;
        if (!serverQueue) return sendError("Não há nenhuma música sendo reproduzida.", message.channel)
        if (serverQueue.voiceChannel.id !== message.member.voice.channel.id) {
            serverQueue.textChannel.send({
                embeds: [{
                    color: "RED",
                    description: "❌ **O bot está sendo utilizado em outro canal!**"
                }]
            })
            return;
        }

        if (!args.length && !query1 && !query2) return
        if (!oldPosition) return sendError("Você deve inserir a posição atual da música e em seguida a nova posição.\n**Exemplo:**" + `${process.env.PREFIX_KEY}move [posição atual] [nova posição]`, message.channel);
        if (!newPosition) return sendError("Você deve inserir a posição atual da música e em seguida a nova posição.\n**Exemplo:**" + `${process.env.PREFIX_KEY}move [posição atual] [nova posição]`, message.channel);

        if (isNaN(oldPosition) || oldPosition <= 1 || oldPosition === newPosition) return sendError("Informe valores válidos!", message.channel);
        if (isNaN(newPosition) || newPosition <= 1 || newPosition === oldPosition) return sendError("Informe valores válidos!", message.channel);

        let song = serverQueue.songs[oldPosition - 1].title;

        try {
            serverQueue.songs = Move().move(serverQueue.songs, oldPosition - 1, newPosition == 1 ? 1 : newPosition - 1);
            message.reply({
                embeds: [
                    {
                        color: "YELLOW",
                        description: `**${song}** agora está na posição **${newPosition}** da fila.`
                    }
                ]
            })
        } catch (e) {
            console.log(e);
        }
    }
}