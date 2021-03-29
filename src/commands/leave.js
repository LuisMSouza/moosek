////////////////// IMPORTS //////////////////////
const sendError = require('../utils/error.js');
const { execute } = require('./play.js');

////////////////// SOURCE CODE //////////////////
module.exports = {
    name: "sair",
    description: "Para o bot sair no chat",
    usage: [process.env.PREFIX_KEY + 'sair'],
    category: 'user',
    timeout: 7000,
    aliases: ['lv', 'leave'],

    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        const serverQueue = client.queue.get(message.guild.id);

        if (!voiceChannel) return sendError("Você precisa estar em um canal de voz para iniciar uma música!", message.channel).then(m => m.delete({ timeout: 10000 }));
        if (serverQueue) return;
        const bot = message.guild.members.cache.get(client.user.id);
        if (bot.voice.channel != message.member.voice.channel) {
            return message.channel.send({
                embed: {
                    description: "❌ **O bot já está sendo utilizado!**"
                }
            }).then(m2 => m2.delete({ timeout: 10000 }))
        }
        try {
            await voiceChannel.leave();
            message.channel.send({
                embed: {
                    color: "#701AAB",
                    description: `**Saí do canal ;)**`
                }
            });
        } catch (e) {
            console.log(e);
        }
    }
}