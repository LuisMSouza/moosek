/////////////////////// IMPORTS ///////////////////////////
const sendError = require('../utils/error.js');
const Move = require('alib-array')

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    name: "mover",
    description: "Para mover uma música de posição na fila",
    usage: [process.env.PREFIX_KEY + 'mover [posição atual] [nova posição]'],
    category: 'user',
    timeout: 5000,
    aliases: ['mv', 'move'],
    input: 'posição',
    resInput: 'NOVA POSIÇÃO PARA A MÚSICA NA FILA',

    async execute(client, message, args) {
        const serverQueue = client.queue.get(message.guild.id);
        var oldPosition = args[0];
        var newPosition = args[1];
        if (!serverQueue) return sendError("Não há nenhuma música sendo reproduzida.", message.channel)

        if (!args.length) return
        if (!oldPosition) return sendError("Você deve inserir a posição atual da música e em seguida a nova posição.\n**Exemplo:**" + `${process.env.PREFIX_KEY}move [posição atual] [nova posição]`, message.channel);
        if (!newPosition) return sendError("Você deve inserir a posição atual da música e em seguida a nova posição.\n**Exemplo:**" + `${process.env.PREFIX_KEY}move [posição atual] [nova posição]`, message.channel);

        if (isNaN(oldPosition) || oldPosition <= 1 || oldPosition === newPosition) return sendError("Informe valores válidos!", message.channel);
        if (isNaN(newPosition) || newPosition <= 1 || newPosition === oldPosition) return sendError("Informe valores válidos!", message.channel);

        let song = serverQueue.songs[oldPosition - 1].title;

        try {
            serverQueue.songs = Move().move(serverQueue.songs, oldPosition - 1, newPosition == 1 ? 1 : newPosition - 1);
            message.channel.send({
                embeds: [
                    {
                        color: "#0f42dc",
                        description: `**${song}** agora está na posição **${newPosition}** da fila.`
                    }
                ]
            })
        } catch (e) {
            console.log(e);
        }
    }
}