const ms = require('ms');
const { MessageEmbed } = require('discord.js');
const { CLIENT_VERSION } = require('../utils/botUtils.js');

module.exports = {
    name: "info",
    description: "Mostra informações do bot",
    usage: [process.env.PREFIX_KEY + 'info'],
    category: 'user',
    timeout: 7000,
    aliases: ['i', 'infos', 'status', 'stats'],

    async execute(client, message, args) {
        let ping = Math.round(message.client.ws.ping);
        let embed = new MessageEmbed()
            .setThumbnail(client.user.displayAvatarURL())
            .setColor("#701AAB")
            .setTitle(`Informações`)
            .addField("Estou presente em:", client.guilds.cache.size + ` servidores`, true)
            .addField("Atividade atual:", client.user.presence.activities[0] ? client.user.presence.activities[0] : "Nenhuma atividade", true)
            .addField("Meu ID é:", client.user.id, true)
            .addField("Estou ativo há:", ms(client.uptime), true)
            .addField("Status atual:", client.user.presence.status, true)
            .addField("Ping atual:", `${ping} ms`, true)
            .addField("Versão atual:", `${CLIENT_VERSION}`, true)
            .addField("Alcancei um total de:", client.users.cache.size + ` pessoas`, true)

        message.channel.send(embed)
    }
}