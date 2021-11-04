/////////////////////// IMPORTS //////////////////////////
const sendError = require('../utils/error.js')

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    name: "now",
    description: "Para ver a música que está tocando no servidor",
    usage: [process.env.PREFIX_KEY + 'now'],
    category: 'user',
    timeout: 7000,
    aliases: ['tocando', 'nowplaying'],
    options: [{
        name: "none",
        description: "NONE",
        type: "STRING",
        required: true
    }],

    async execute(client, message, args) {
        const serverQueue = client.queue.get(message.guild.id);

        if (!serverQueue) return sendError("Não há nenhuma música sendo reproduzida.", message.channel).then(m => m.delete({ timeout: 10000 }));
        message.channel.send({
            embeds: [
                {
                    title: "Tocando agora:",
                    color: "#0f42dc",
                    description: `**${serverQueue.songs[0].title}**`
                }
            ]
        })
    }
}