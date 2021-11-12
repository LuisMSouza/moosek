////////////////// IMPORTS //////////////////////
const sendError = require('../utils/error.js');
const { MessageEmbed } = require('discord.js');

////////////////// SOURCE CODE //////////////////
module.exports = {
    name: "sair",
    description: "Para o bot sair no chat",
    usage: [process.env.PREFIX_KEY + 'sair'],
    category: 'user',
    timeout: 7000,
    aliases: ['lv', 'leave'],
    options: [{
        name: "none",
        description: "NONE",
        type: 3,
        required: true
    }],

    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        const serverQueue = client.queue.get(message.guild.id);

        if (!voiceChannel) return sendError("Você precisa estar em um canal de voz para iniciar uma música!", message.channel).then(m => m.delete({ timeout: 10000 }));
        if (serverQueue) return;
        const bot = message.guild.members.cache.get(client.user.id);
        if (bot.voice.channel != message.member.voice.channel) {
            return sendError("❌ **O bot já está sendo utilizado!**", message.channel);
        }
        try {
            await message.guild.me.voice.disconnect();
            let emb = new MessageEmbed()
                .setColor("#2592b0")
                .setDescription(`**Saí do canal ;)**`)
            message.channel.send({
                embeds: [emb]
            })
        } catch (e) {
            console.log(e);
        }
    }
}