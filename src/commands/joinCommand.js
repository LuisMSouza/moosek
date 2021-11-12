////////////////// IMPORTS //////////////////////
const sendError = require('../utils/error.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');

////////////////// SOURCE CODE //////////////////
module.exports = {
    name: "entrar",
    description: "Para o bot entrar do chat",
    usage: [process.env.PREFIX_KEY + 'entrar'],
    category: 'user',
    timeout: 7000,
    aliases: ['e', 'join'],
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
        if (bot.voice.channel) {
            return sendError("❌ **O bot já está sendo utilizado!**", message.channel);
        }
        try {
            await joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: message.guild.id,
                adapterCreator: message.channel.guild.voiceAdapterCreator,
            });
            let emb = new MessageEmbed()
                .setColor("#2592b0")
                .setDescription(`Me juntei ao canal **${message.member.voice.channel.name}**`)

            message.channel.send({
                embeds: [
                    emb
                ]
            });
        } catch (e) {
            console.log(e);
        }
    }
}